import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { api } from '../../services/api';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Info,
  ArrowRight,
  Database,
  RefreshCw,
  FileSpreadsheet,
  Download,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

interface BulkProductUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export interface ParsedCsvProduct {
  resellerPrice: number;
  customerPrice: number;
  imageUrl: string;
  name: string;
  oldPrice?: number;
  discountAmount?: number;
  description: string;
}

export interface ColumnMapping {
  resellerIdx: number;
  customerIdx: number;
  nameIdx: number;
  imageIdx: number;
  oldPriceIdx: number;
  discountIdx: number;
  descIdx: number;
  slIdx: number;
  headers: string[];
  totalColumns: number;
  samplesByCol: string[];
}

export interface ParseResult {
  products: ParsedCsvProduct[];
  mapping: ColumnMapping;
  hasSerialColumn: boolean;
  warnings: string[];
}

const BN_DIGITS: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

export function parseCleanNumber(val: any): number {
  if (val === undefined || val === null) return 0;
  let s = String(val).trim();
  if (!s) return 0;
  // Convert Bengali digits
  s = s.replace(/[০-৯]/g, (d) => BN_DIGITS[d] || d);
  // Remove currency signs, commas, and whitespace
  s = s.replace(/৳|tk\.?|bdt|\$|rs\.?/gi, '');
  s = s.replace(/,/g, '');
  s = s.replace(/\s+/g, '');
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}

/**
 * Universal Intelligent CSV & TSV Parser supporting:
 * - Bengali and English numerals (০-৯ and 0-9)
 * - Auto-detects and excludes Serial Number / SL / ID columns (1, 2, 3...) so they are never assigned to prices
 * - Intelligent price detection: Wholesale is lower price, Customer is retail price
 * - Currency symbols (৳, Tk, BDT) & thousands separators
 * - Bengali and English headers
 * - Tab-separated (Excel / Google Sheets direct paste) & comma-separated (.csv)
 */
export function parseUniversalCsvWithMeta(
  text: string,
  overrides?: Partial<{
    resellerIdx: number;
    customerIdx: number;
    nameIdx: number;
    imageIdx: number;
    oldPriceIdx: number;
    discountIdx: number;
    descIdx: number;
  }>
): ParseResult {
  if (!text) {
    return {
      products: [],
      mapping: {
        resellerIdx: -1, customerIdx: -1, nameIdx: -1, imageIdx: -1,
        oldPriceIdx: -1, discountIdx: -1, descIdx: -1, slIdx: -1,
        headers: [], totalColumns: 0, samplesByCol: [],
      },
      hasSerialColumn: false,
      warnings: [],
    };
  }

  const cleanText = text.replace(/^\uFEFF/, '').trim();
  if (!cleanText) {
    return {
      products: [],
      mapping: {
        resellerIdx: -1, customerIdx: -1, nameIdx: -1, imageIdx: -1,
        oldPriceIdx: -1, discountIdx: -1, descIdx: -1, slIdx: -1,
        headers: [], totalColumns: 0, samplesByCol: [],
      },
      hasSerialColumn: false,
      warnings: [],
    };
  }

  // Detect delimiter
  const firstLine = cleanText.split(/[\r\n]+/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  let delimiter = ',';
  if (tabCount > commaCount && tabCount > semiCount) {
    delimiter = '\t';
  } else if (semiCount > commaCount) {
    delimiter = ';';
  }

  // Parse lines and cells (RFC-4180 standard)
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) {
    return {
      products: [],
      mapping: {
        resellerIdx: -1, customerIdx: -1, nameIdx: -1, imageIdx: -1,
        oldPriceIdx: -1, discountIdx: -1, descIdx: -1, slIdx: -1,
        headers: [], totalColumns: 0, samplesByCol: [],
      },
      hasSerialColumn: false,
      warnings: [],
    };
  }

  // Check if row 0 is a genuine header row
  const isHeaderRow = (r: string[]) => {
    if (!r || r.length === 0) return false;

    // Never a header row if any cell is an image link or file URL
    const hasUrl = r.some((c) => {
      const s = c.toLowerCase().trim();
      return (
        s.startsWith('http://') ||
        s.startsWith('https://') ||
        s.includes('.jpg') ||
        s.includes('.png') ||
        s.includes('.webp') ||
        s.includes('storage/')
      );
    });
    if (hasUrl) return false;

    // Never a header row if the first cell is a price (> 20)
    const firstClean = parseCleanNumber(r[0]);
    if (firstClean > 20) return false;

    let headerMatchCount = 0;
    for (const cell of r) {
      const h = cell.toLowerCase().trim();
      if (!h) continue;
      if (
        h === 'sl' || h === 'no' || h === '#' || h === 'id' || h === 'serial' || h === 'ক্রম' || h === 'ক্রমিক' || h === 'নং' ||
        h.includes('wholesale') || h.includes('resell') || h.includes('পাইকারি') || h.includes('পাইকারী') || h.includes('ক্রয়') || h.includes('কেনা') || h.includes('cost') || h.includes('tp') ||
        h.includes('customer') || h.includes('retail') || h.includes('selling') || h.includes('mrp') || h.includes('বিক্র') || h.includes('খুচরা') || h.includes('গ্রাহক') ||
        h.includes('product') || h.includes('title') || h.includes('item') || h.includes('পণ্য') || h.includes('নাম') ||
        h.includes('image') || h.includes('photo') || h.includes('picture') || h.includes('pic') || h.includes('url') || h.includes('ছবি') ||
        h.includes('old price') || h.includes('regular price') || h.includes('compare') || h.includes('strikethrough') || h.includes('পূর্বের') || h.includes('আগের') ||
        h.includes('discount') || h.includes('ছাড়') || h.includes('ছাড়') || h.includes('ডিসকাউন্ট') ||
        h.includes('description') || h.includes('desc') || h.includes('বিবরণ') || h.includes('বর্ণনা')
      ) {
        headerMatchCount++;
      }
    }
    return headerMatchCount >= Math.min(2, r.length);
  };

  let startIndex = 0;
  let headerSlIdx = -1;
  let headerNameIdx = -1;
  let headerResellerIdx = -1;
  let headerCustomerIdx = -1;
  let headerImageIdx = -1;
  let headerOldPriceIdx = -1;
  let headerDiscountIdx = -1;
  let headerDescIdx = -1;
  const rawHeaders: string[] = [];

  if (isHeaderRow(rows[0])) {
    startIndex = 1;
    rows[0].forEach((rawHeader, idx) => {
      rawHeaders.push(rawHeader.trim());
      const h = rawHeader.toLowerCase().trim();

      // Serial / Sl / Index / No / Code
      if (/^(sl|serial|no|#|id|index|ক্রম|ক্রমিক|আইডি|কোড|নং)(\s|$|\.)/i.test(h) || h === 'sl' || h === 'no' || h === '#' || h === 'id') {
        if (headerSlIdx === -1) headerSlIdx = idx;
        return;
      }
      // Old Price / Strikethrough / Previous
      if (h.includes('old') || h.includes('previous') || h.includes('strikethrough') || h.includes('পূর্বের') || h.includes('আগের') || h.includes('compare')) {
        if (headerOldPriceIdx === -1) headerOldPriceIdx = idx;
        return;
      }
      // Discount
      if (h.includes('discount') || h.includes('off') || h.includes('ছাড়') || h.includes('ছাড়') || h.includes('ডিসকাউন্ট')) {
        if (headerDiscountIdx === -1) headerDiscountIdx = idx;
        return;
      }
      // Reseller / Wholesale (Exclude বিক্র / বিক্রি so customer price is not hijacked)
      if (!h.includes('বিক্র') && !h.includes('বিক্রি') && !h.includes('retail') && !h.includes('customer') && (
        h.includes('resell') || h.includes('wholesale') || h.includes('পাইকারি') || h.includes('পাইকারী') ||
        h.includes('রিসেল') || h.includes('ক্রয়') || h.includes('কেনা') || h.includes('cost') ||
        h.includes('buy') || h.includes('buying') || h.includes('dealer') || h.includes('agent') || h.includes('tp')
      )) {
        if (headerResellerIdx === -1) headerResellerIdx = idx;
        return;
      }
      // Customer / Retail / Selling Price
      if (
        h.includes('customer') || h.includes('retail') || h.includes('selling') || h.includes('mrp') ||
        h.includes('বিক্র') || h.includes('বিক্রি') || h.includes('খুচরা') || h.includes('গ্রাহক') || h.includes('sale price')
      ) {
        if (headerCustomerIdx === -1) headerCustomerIdx = idx;
        return;
      }
      // Image
      if (h.includes('image') || h.includes('img') || h.includes('link') || h.includes('src') || h.includes('photo') || h.includes('pic') || h.includes('url') || h.includes('ছবি')) {
        if (headerImageIdx === -1) headerImageIdx = idx;
        return;
      }
      // Desc
      if (h.includes('desc') || h.includes('detail') || h.includes('বিবরণ') || h.includes('বর্ণনা') || h.includes('specification')) {
        if (headerDescIdx === -1) headerDescIdx = idx;
        return;
      }
      // Name
      if (h.includes('name') || h.includes('title') || h.includes('নাম') || h.includes('product') || h.includes('item') || h.includes('পণ্য')) {
        if (headerNameIdx === -1) headerNameIdx = idx;
        return;
      }
    });
  }

  // Profile actual data rows to verify / auto-discover column roles
  const dataRows = rows.slice(startIndex, startIndex + 50).filter((r) => r.length > 1);
  const maxCols = Math.max(...rows.map((r) => r.length));

  const samplesByCol: string[] = [];
  for (let c = 0; c < maxCols; c++) {
    const firstSample = dataRows.find((r) => r[c] && r[c].trim().length > 0)?.[c] || '';
    samplesByCol.push(firstSample);
  }

  const colProfiles: Array<{
    col: number;
    isSerial: boolean;
    isUrl: boolean;
    isText: boolean;
    isLongText: boolean;
    isNumeric: boolean;
    avgNum: number;
    avgLen: number;
  }> = [];

  for (let c = 0; c < maxCols; c++) {
    const rawVals = dataRows.map((r) => (r[c] || '').trim()).filter((v) => v.length > 0);
    const numVals = rawVals.map(parseCleanNumber).filter((n) => n > 0);
    const urlCount = rawVals.filter((v) => v.startsWith('http') || v.includes('.jpg') || v.includes('.png') || v.includes('.webp') || v.includes('storage/')).length;
    const isUrl = rawVals.length > 0 && urlCount >= rawVals.length * 0.35;

    // Check if column is a Serial Number / Row Counter (e.g. 1, 2, 3...)
    let isSerial = false;
    if (headerSlIdx === c) {
      isSerial = true;
    } else if (c === 0 && rawVals.length >= 2 && numVals.length === rawVals.length) {
      const isSequential = numVals.every((n, i) => (i === 0 ? n === 1 || n === 0 : n === numVals[i - 1] + 1));
      const isSmallInts = numVals.every((n) => n > 0 && n <= rows.length + 20 && Number.isInteger(n));
      if (isSequential || isSmallInts) {
        isSerial = true;
      }
    }

    const numericRatio = rawVals.length > 0 ? numVals.length / rawVals.length : 0;
    const isNumeric = !isUrl && !isSerial && numericRatio >= 0.6;
    const avgNum = numVals.length > 0 ? numVals.reduce((a, b) => a + b, 0) / numVals.length : 0;
    const avgLen = rawVals.length > 0 ? rawVals.reduce((a, b) => a + b.length, 0) / rawVals.length : 0;
    const isText = !isUrl && !isNumeric && !isSerial && avgLen > 2;
    const isLongText = isText && avgLen > 35;

    colProfiles.push({ col: c, isSerial, isUrl, isText, isLongText, isNumeric, avgNum, avgLen });
  }

  const detectedSerialCol = colProfiles.find((p) => p.isSerial)?.col ?? (headerSlIdx !== -1 ? headerSlIdx : -1);
  const detectedUrlCol = colProfiles.find((p) => p.isUrl)?.col ?? headerImageIdx;

  let finalResellerIdx = overrides?.resellerIdx ?? headerResellerIdx;
  let finalCustomerIdx = overrides?.customerIdx ?? headerCustomerIdx;
  let finalImageIdx = overrides?.imageIdx ?? (headerImageIdx !== -1 ? headerImageIdx : (detectedUrlCol !== undefined && detectedUrlCol !== -1 ? detectedUrlCol : -1));
  let finalNameIdx = overrides?.nameIdx ?? headerNameIdx;
  let finalOldPriceIdx = overrides?.oldPriceIdx ?? headerOldPriceIdx;
  let finalDiscountIdx = overrides?.discountIdx ?? headerDiscountIdx;
  let finalDescIdx = overrides?.descIdx ?? headerDescIdx;

  // Layout-aware Auto Detection
  if (finalResellerIdx === -1 || finalCustomerIdx === -1 || finalNameIdx === -1) {
    if (detectedSerialCol === 0) {
      // 8-column schemas with SL at col 0
      if (finalImageIdx === 4) {
        // Col 0: SL, Col 1: Name, Col 2: Wholesale, Col 3: Customer, Col 4: Image, Col 5: Old, Col 6: Disc, Col 7: Desc
        if (finalNameIdx === -1) finalNameIdx = 1;
        if (finalResellerIdx === -1) finalResellerIdx = 2;
        if (finalCustomerIdx === -1) finalCustomerIdx = 3;
        if (finalOldPriceIdx === -1) finalOldPriceIdx = 5;
        if (finalDiscountIdx === -1) finalDiscountIdx = 6;
        if (finalDescIdx === -1) finalDescIdx = 7;
      } else if (finalImageIdx === 3 || finalImageIdx === 2) {
        // Col 0: SL, Col 1: Wholesale, Col 2: Customer, Col 3: Image, Col 4: Name
        if (finalResellerIdx === -1) finalResellerIdx = 1;
        if (finalCustomerIdx === -1) finalCustomerIdx = 2;
        if (finalNameIdx === -1) finalNameIdx = 4;
        if (finalOldPriceIdx === -1) finalOldPriceIdx = 5;
        if (finalDiscountIdx === -1) finalDiscountIdx = 6;
        if (finalDescIdx === -1) finalDescIdx = 7;
      }
    } else {
      // No SL column at col 0
      if (finalImageIdx === 2) {
        // Standard advertised 7-column schema:
        // Col 0: Wholesale, Col 1: Customer, Col 2: Image, Col 3: Name, Col 4: Old, Col 5: Disc, Col 6: Desc
        if (finalResellerIdx === -1) finalResellerIdx = 0;
        if (finalCustomerIdx === -1) finalCustomerIdx = 1;
        if (finalNameIdx === -1) finalNameIdx = 3;
        if (finalOldPriceIdx === -1) finalOldPriceIdx = 4;
        if (finalDiscountIdx === -1) finalDiscountIdx = 5;
        if (finalDescIdx === -1) finalDescIdx = 6;
      } else if (finalImageIdx === 3) {
        // Col 0: Name, Col 1: Wholesale, Col 2: Customer, Col 3: Image, Col 4: Old, Col 5: Disc, Col 6: Desc
        if (finalNameIdx === -1) finalNameIdx = 0;
        if (finalResellerIdx === -1) finalResellerIdx = 1;
        if (finalCustomerIdx === -1) finalCustomerIdx = 2;
        if (finalOldPriceIdx === -1) finalOldPriceIdx = 4;
        if (finalDiscountIdx === -1) finalDiscountIdx = 5;
        if (finalDescIdx === -1) finalDescIdx = 6;
      } else if (finalImageIdx === 4) {
        // Col 0: Code, Col 1: Name, Col 2: Wholesale, Col 3: Customer, Col 4: Image
        if (finalNameIdx === -1) finalNameIdx = 1;
        if (finalResellerIdx === -1) finalResellerIdx = 2;
        if (finalCustomerIdx === -1) finalCustomerIdx = 3;
        if (finalOldPriceIdx === -1) finalOldPriceIdx = 5;
        if (finalDiscountIdx === -1) finalDiscountIdx = 6;
        if (finalDescIdx === -1) finalDescIdx = 7;
      }
    }
  }

  // Final fallbacks for any remaining unmapped columns
  if (finalNameIdx === -1) {
    const textCol = colProfiles.find((p) => p.isText && !p.isLongText && p.col !== finalDescIdx && p.col !== finalImageIdx && p.col !== detectedSerialCol);
    if (textCol) finalNameIdx = textCol.col;
    else finalNameIdx = detectedSerialCol === 0 ? 1 : 0;
  }
  if (finalResellerIdx === -1) {
    const numCol = colProfiles.find((p) => p.isNumeric && p.col !== detectedSerialCol && p.col !== finalImageIdx && p.col !== finalCustomerIdx);
    if (numCol) finalResellerIdx = numCol.col;
    else finalResellerIdx = detectedSerialCol === 0 ? 2 : 0;
  }
  if (finalCustomerIdx === -1) {
    const numCol = colProfiles.find((p) => p.isNumeric && p.col !== detectedSerialCol && p.col !== finalImageIdx && p.col !== finalResellerIdx);
    if (numCol) finalCustomerIdx = numCol.col;
    else finalCustomerIdx = detectedSerialCol === 0 ? 3 : 1;
  }
  if (finalImageIdx === -1) {
    finalImageIdx = detectedSerialCol === 0 ? 4 : 2;
  }
  if (finalDescIdx === -1) {
    const longCol = colProfiles.find((p) => p.isLongText && p.col !== finalNameIdx);
    if (longCol) finalDescIdx = longCol.col;
  }

  const warnings: string[] = [];
  let lowPriceCount = 0;
  const products: ParsedCsvProduct[] = [];

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    let resellerPrice = Math.round(parseCleanNumber(row[finalResellerIdx]));
    let customerPrice = Math.round(parseCleanNumber(row[finalCustomerIdx]));
    const oldPrice = finalOldPriceIdx !== -1 && row[finalOldPriceIdx] ? Math.round(parseCleanNumber(row[finalOldPriceIdx])) : undefined;
    const discountAmount = finalDiscountIdx !== -1 && row[finalDiscountIdx] ? Math.round(parseCleanNumber(row[finalDiscountIdx])) : undefined;

    // Sanity checks on prices:
    // If retail price is missing, auto calculate reasonable retail margin
    if (customerPrice === 0 && resellerPrice > 0) {
      customerPrice = Math.round(resellerPrice * 1.4);
    } else if (resellerPrice === 0 && customerPrice > 0) {
      resellerPrice = Math.round(customerPrice * 0.7);
    } else if (customerPrice > 0 && resellerPrice > 0 && customerPrice < resellerPrice) {
      // If customer price is lower than wholesale price, user inverted the two columns
      const temp = customerPrice;
      customerPrice = resellerPrice;
      resellerPrice = temp;
    }

    if (resellerPrice > 0 && resellerPrice <= 10) {
      lowPriceCount++;
    }

    const rawName = row[finalNameIdx] ? row[finalNameIdx].replace(/^"+|"+$/g, '').trim() : '';
    // Preserve exact product name; only fallback if completely empty
    const name = rawName && rawName.length > 0 ? rawName : `Product ${i + 1}`;
    const rawImage = row[finalImageIdx] ? row[finalImageIdx].replace(/^"+|"+$/g, '').trim() : '';
    const imageUrl = rawImage.startsWith('http') ? rawImage : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
    const description = finalDescIdx !== -1 && row[finalDescIdx] ? row[finalDescIdx].replace(/^"+|"+$/g, '').trim() : '';

    if (resellerPrice > 0 || customerPrice > 0 || name.length > 1) {
      products.push({
        resellerPrice,
        customerPrice,
        imageUrl,
        name,
        oldPrice: oldPrice && oldPrice > 0 ? oldPrice : undefined,
        discountAmount: discountAmount && discountAmount > 0 ? discountAmount : undefined,
        description,
      });
    }
  }

  if (lowPriceCount > 0) {
    warnings.push(`${lowPriceCount} items have prices of ৳10 or less. Please check column mapping.`);
  }

  const mapping: ColumnMapping = {
    resellerIdx: finalResellerIdx,
    customerIdx: finalCustomerIdx,
    nameIdx: finalNameIdx,
    imageIdx: finalImageIdx,
    oldPriceIdx: finalOldPriceIdx,
    discountIdx: finalDiscountIdx,
    descIdx: finalDescIdx,
    slIdx: detectedSerialCol,
    headers: rawHeaders,
    totalColumns: maxCols,
    samplesByCol,
  };

  return {
    products,
    mapping,
    hasSerialColumn: detectedSerialCol !== -1,
    warnings,
  };
}

/**
 * Backward compatibility wrapper returning product array
 */
export function parse7ColumnCsv(text: string): ParsedCsvProduct[] {
  return parseUniversalCsvWithMeta(text).products;
}

export const BulkProductUploaderModal: React.FC<BulkProductUploaderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [csvText, setCsvText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedCsvProduct[]>([]);
  const [detectedMapping, setDetectedMapping] = useState<ColumnMapping | null>(null);
  const [hasSerialColumn, setHasSerialColumn] = useState(false);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [showCustomMapping, setShowCustomMapping] = useState(false);
  const [columnOverrides, setColumnOverrides] = useState<{
    resellerIdx?: number;
    customerIdx?: number;
    nameIdx?: number;
    imageIdx?: number;
    oldPriceIdx?: number;
    discountIdx?: number;
    descIdx?: number;
  }>({});
  const [replaceAll, setReplaceAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const executeParse = (
    text: string,
    overrides: typeof columnOverrides = columnOverrides
  ) => {
    setCsvText(text);
    if (!text.trim()) {
      setParsedItems([]);
      setDetectedMapping(null);
      setHasSerialColumn(false);
      setParseWarnings([]);
      setStatusMessage(null);
      return;
    }

    try {
      const result = parseUniversalCsvWithMeta(text, overrides);
      setParsedItems(result.products);
      setDetectedMapping(result.mapping);
      setHasSerialColumn(result.hasSerialColumn);
      setParseWarnings(result.warnings);

      if (result.products.length > 0) {
        setStatusMessage({
          type: 'info',
          text: `Successfully parsed ${result.products.length} products ready for import.${
            result.hasSerialColumn ? ' (Serial column detected and skipped)' : ''
          }`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Could not detect valid product rows. Please check CSV format.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to parse CSV format: ' + err.message,
      });
    }
  };

  const handleParseText = (text: string) => {
    executeParse(text, columnOverrides);
  };

  const handleOverrideColumn = (
    key: 'resellerIdx' | 'customerIdx' | 'nameIdx' | 'imageIdx' | 'oldPriceIdx',
    value: number
  ) => {
    const updated = { ...columnOverrides, [key]: value };
    setColumnOverrides(updated);
    executeParse(csvText, updated);
  };

  const handleResetOverrides = () => {
    setColumnOverrides({});
    executeParse(csvText, {});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseText(content);
    };
    reader.readAsText(file);
  };

  const handleImportToDatabase = async () => {
    if (parsedItems.length === 0) {
      setStatusMessage({ type: 'error', text: 'No products to import. Paste CSV or upload a file first.' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: `Importing ${parsedItems.length} products to database & Firestore...` });

    try {
      const payload = parsedItems.map((p) => ({
        name: p.name,
        nameBn: p.name,
        resellerPrice: p.resellerPrice,
        suggestedSellingPrice: p.customerPrice,
        oldPrice: p.oldPrice,
        discountAmount: p.discountAmount || (p.oldPrice && p.oldPrice > p.customerPrice ? p.oldPrice - p.customerPrice : undefined),
        baseCost: Math.round(p.resellerPrice * 0.85),
        images: [p.imageUrl],
        description: p.description,
        stock: 150,
      }));

      const res = await api.bulkCreateProducts({
        products: payload,
        replaceAll,
      });

      setStatusMessage({
        type: 'success',
        text: res.message || `Successfully imported ${res.count} products!`,
      });

      setTimeout(() => {
        onSuccess(res.count);
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Bulk upload failed. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleTemplate = (withSerial: boolean = false) => {
    let sample = '';
    let filename = '';

    if (withSerial) {
      filename = 'shadhin_products_template_with_sl.csv';
      sample = `SL,Product Name,Wholesale Price,Customer Price,Image Link,Old Price,Discount,Description
1,Cotton Casual T-Shirt,350,600,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800,750,150,"প্রিমিয়াম সুতি কাপড়ের টি-শার্ট"
2,Executive Smart Watch,1200,1800,https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800,2200,400,"স্মার্ট কলিং এবং হার্টরেট মনিটর"
3,Leather Travel Bag,950,1500,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800,1800,300,"টেকসই ওয়াটারপ্রুফ ট্রাভেল ব্যাগ"`;
    } else {
      filename = 'shadhin_products_7col_template.csv';
      sample = `Wholesale Price,Customer Price,Image Link,Product Name,Old Price,Discount,Description
350,600,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800,Cotton Casual T-Shirt,750,150,"প্রিমিয়াম সুতি কাপড়ের টি-শার্ট"
1200,1800,https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800,Executive Smart Watch,2200,400,"স্মার্ট কলিং এবং হার্টরেট মনিটর"
950,1500,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800,Leather Travel Bag,1800,300,"টেকসই ওয়াটারপ্রুফ ট্রাভেল ব্যাগ"`;
    }

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Bulk Product CSV Uploader</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Universal Format (Up to 1,000+ Items)
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload or paste CSV/TSV from Excel, Google Sheets, or files. Auto-detects column order, English & Bengali numerals.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Format Specification Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Supported CSV Layouts (Auto-Detected):</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadSampleTemplate(false)}
                  className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download 7-Col CSV</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => downloadSampleTemplate(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download CSV with SL / Name First</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">COL 1</span>
                <span className="font-bold text-slate-800">Wholesale Price (৳)</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">COL 2</span>
                <span className="font-bold text-slate-800">Customer Price (৳)</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">COL 3</span>
                <span className="font-bold text-slate-800">Image Link (URL)</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">COL 4</span>
                <span className="font-bold text-slate-800">Product Name</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">COL 5</span>
                <span className="font-bold text-slate-800">Old Strikethrough (৳)</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">COL 6</span>
                <span className="font-bold text-slate-800">Discount Amount (৳)</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">COL 7</span>
                <span className="font-bold text-slate-800">Bangla Description</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              💡 <em>Files with a Serial Number column (SL, 1, 2, 3...) or Product Name first are automatically aligned. You can also adjust mapping manually below if needed.</em>
            </p>
          </div>

          {/* Upload Area / Drag & Drop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="md:col-span-1 p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl bg-slate-50/50 hover:bg-emerald-50/30 transition cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.txt"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-300 flex items-center justify-center mb-3 transition">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-900">Upload CSV File</span>
              <span className="text-[11px] text-slate-400 mt-1">Click to browse or drop .csv / .txt file</span>
            </div>

            {/* Paste Raw CSV Area */}
            <div className="md:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Or Paste CSV Text Directly</span>
                </label>
                {parsedItems.length > 0 && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {parsedItems.length} Products Detected
                  </span>
                )}
              </div>

              <textarea
                value={csvText}
                onChange={(e) => handleParseText(e.target.value)}
                placeholder={`"194.25","700","https://.../img.jpg","Blue Heart Bottle Locket","833","133","বিস্তারিত বাংলা বিবরণ..."`}
                className="w-full h-32 p-3 font-mono text-[11px] text-slate-950 font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl border flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              {statusMessage.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* Warnings Banner if any */}
          {parseWarnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Notice on Prices:</span>
                {parseWarnings.map((w, idx) => (
                  <p key={idx} className="text-[11px] text-amber-700 font-medium">
                    {w} If your file has an ID or Serial Number column (1, 2, 3...), click <strong>Adjust Mapping</strong> below to confirm Wholesale Price is mapped to your actual pricing column.
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Detected Column Mapping Card */}
          {detectedMapping && detectedMapping.totalColumns > 0 && (
            <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Column Auto-Detection & Pricing Alignment:</span>
                  {hasSerialColumn && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                      Serial / SL Column Excluded from Pricing
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowCustomMapping(!showCustomMapping)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-white rounded-lg border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showCustomMapping ? 'Close Column Controls' : 'Adjust Mapping Manually'}</span>
                </button>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <span className="text-slate-400 font-bold mr-1">Product:</span>
                  <strong className="text-slate-800">
                    Col {detectedMapping.nameIdx + 1}
                    {detectedMapping.headers[detectedMapping.nameIdx] ? ` (${detectedMapping.headers[detectedMapping.nameIdx]})` : ''}
                  </strong>
                </div>

                <div className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl shadow-2xs">
                  <span className="text-indigo-400 font-bold mr-1">Wholesale (৳):</span>
                  <strong>
                    Col {detectedMapping.resellerIdx + 1}
                    {detectedMapping.headers[detectedMapping.resellerIdx] ? ` (${detectedMapping.headers[detectedMapping.resellerIdx]})` : ''}
                  </strong>
                </div>

                <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl shadow-2xs">
                  <span className="text-emerald-500 font-bold mr-1">Customer (৳):</span>
                  <strong>
                    Col {detectedMapping.customerIdx + 1}
                    {detectedMapping.headers[detectedMapping.customerIdx] ? ` (${detectedMapping.headers[detectedMapping.customerIdx]})` : ''}
                  </strong>
                </div>

                <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <span className="text-slate-400 font-bold mr-1">Image:</span>
                  <strong className="text-slate-800">
                    Col {detectedMapping.imageIdx + 1}
                    {detectedMapping.headers[detectedMapping.imageIdx] ? ` (${detectedMapping.headers[detectedMapping.imageIdx]})` : ''}
                  </strong>
                </div>

                {detectedMapping.oldPriceIdx !== -1 && (
                  <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                    <span className="text-slate-400 font-bold mr-1">Old Price:</span>
                    <strong className="text-slate-800">Col {detectedMapping.oldPriceIdx + 1}</strong>
                  </div>
                )}
              </div>

              {/* Manual Mapping Selectors */}
              {showCustomMapping && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                      Wholesale Price Column (পাইকারি)
                    </label>
                    <select
                      value={detectedMapping.resellerIdx}
                      onChange={(e) => handleOverrideColumn('resellerIdx', Number(e.target.value))}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      {Array.from({ length: detectedMapping.totalColumns }).map((_, idx) => (
                        <option key={idx} value={idx}>
                          Col {idx + 1} {detectedMapping.headers[idx] ? `(${detectedMapping.headers[idx]})` : ''} — Sample: "{detectedMapping.samplesByCol[idx]?.slice(0, 15)}"
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                      Customer Price Column (খুচরা)
                    </label>
                    <select
                      value={detectedMapping.customerIdx}
                      onChange={(e) => handleOverrideColumn('customerIdx', Number(e.target.value))}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      {Array.from({ length: detectedMapping.totalColumns }).map((_, idx) => (
                        <option key={idx} value={idx}>
                          Col {idx + 1} {detectedMapping.headers[idx] ? `(${detectedMapping.headers[idx]})` : ''} — Sample: "{detectedMapping.samplesByCol[idx]?.slice(0, 15)}"
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                      Product Name Column (নাম)
                    </label>
                    <select
                      value={detectedMapping.nameIdx}
                      onChange={(e) => handleOverrideColumn('nameIdx', Number(e.target.value))}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      {Array.from({ length: detectedMapping.totalColumns }).map((_, idx) => (
                        <option key={idx} value={idx}>
                          Col {idx + 1} {detectedMapping.headers[idx] ? `(${detectedMapping.headers[idx]})` : ''} — Sample: "{detectedMapping.samplesByCol[idx]?.slice(0, 15)}"
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                      Image URL Column (ছবি লিংক)
                    </label>
                    <select
                      value={detectedMapping.imageIdx}
                      onChange={(e) => handleOverrideColumn('imageIdx', Number(e.target.value))}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      {Array.from({ length: detectedMapping.totalColumns }).map((_, idx) => (
                        <option key={idx} value={idx}>
                          Col {idx + 1} {detectedMapping.headers[idx] ? `(${detectedMapping.headers[idx]})` : ''} — Sample: "{detectedMapping.samplesByCol[idx]?.slice(0, 15)}"
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-full flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleResetOverrides}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline font-bold"
                    >
                      Reset to Auto-Detection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Table */}
          {parsedItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <span>Parsed Products Preview</span>
                  <span className="text-slate-400 font-normal">({parsedItems.length} items ready)</span>
                </h3>

                {/* Replace vs Append Toggle */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setReplaceAll(false)}
                    className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                      !replaceAll ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Append to Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplaceAll(true)}
                    className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                      replaceAll ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Replace Catalog
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Wholesale (৳)</th>
                      <th className="p-3">Customer (৳)</th>
                      <th className="p-3">Old Price (৳)</th>
                      <th className="p-3">Discount (৳)</th>
                      <th className="p-3">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {parsedItems.slice(0, 50).map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-3 flex items-center gap-2.5 max-w-xs">
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                            }}
                          />
                          <div className="truncate">
                            <p className="font-bold text-slate-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.description}</p>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-indigo-700">৳{p.resellerPrice}</td>
                        <td className="p-3 font-bold text-slate-900">৳{p.customerPrice}</td>
                        <td className="p-3 text-slate-400 line-through">
                          {p.oldPrice ? `৳${p.oldPrice}` : '-'}
                        </td>
                        <td className="p-3 text-rose-600 font-bold">
                          {p.discountAmount ? `৳${p.discountAmount}` : '-'}
                        </td>
                        <td className="p-3 font-bold text-emerald-700">
                          +৳{p.customerPrice - p.resellerPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedItems.length > 50 && (
                <p className="text-center text-[11px] text-slate-400 italic">
                  Showing first 50 of {parsedItems.length.toLocaleString()} products. All {parsedItems.length.toLocaleString()} will be imported to database.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-slate-500 text-xs">
            {parsedItems.length > 0 ? (
              <span>
                Ready to import <strong>{parsedItems.length}</strong> items
              </span>
            ) : (
              <span>Upload CSV file or paste spreadsheet data above</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleImportToDatabase}
              disabled={parsedItems.length === 0 || isProcessing}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Import {parsedItems.length} Products to Database</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
