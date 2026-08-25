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

/**
 * Robust RFC 4180 CSV parser supporting multiline quotes, escaped commas, and CRLF
 */
export function parse7ColumnCsv(text: string): ParsedCsvProduct[] {
  const cleanText = text.trim();
  if (!cleanText) return [];

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
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // handle CRLF
      }
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

  if (rows.length === 0) return [];

  const parseNumber = (val: string | undefined): number => {
    if (!val) return 0;
    const clean = val.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  const parsedProducts: ParsedCsvProduct[] = [];

  // Check if row 0 is a header
  const isHeader = (r: string[]) => {
    const combined = r.join(' ').toLowerCase();
    return (
      combined.includes('reselling') ||
      combined.includes('customer') ||
      combined.includes('product') ||
      combined.includes('wholesale') ||
      combined.includes('price') ||
      combined.includes('link')
    );
  };

  const startIndex = isHeader(rows[0]) ? 1 : 0;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue; // skip blank lines

    // 1st col: Reseller Wholesale Price
    const resellerPrice = parseNumber(row[0]);
    // 2nd col: Customer Catalog Price
    const customerPrice = parseNumber(row[1]);
    // 3rd col: Image Link
    const imageUrl = row[2] ? row[2].replace(/^"+|"+$/g, '').trim() : '';
    // 4th col: Product Name
    const name = row[3] ? row[3].replace(/^"+|"+$/g, '').trim() : (row[1] && isNaN(customerPrice) ? row[1] : 'Product ' + (i + 1));
    // 5th col: Old Price
    const oldPrice = row[4] ? parseNumber(row[4]) : undefined;
    // 6th col: Discount
    const discountAmount = row[5] ? parseNumber(row[5]) : undefined;
    // 7th col: Description
    const description = row[6] ? row[6].replace(/^"+|"+$/g, '').trim() : '';

    if (resellerPrice > 0 || customerPrice > 0 || name) {
      parsedProducts.push({
        resellerPrice: Math.round(resellerPrice),
        customerPrice: Math.round(customerPrice),
        imageUrl: imageUrl.startsWith('http') ? imageUrl : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        name,
        oldPrice: oldPrice && oldPrice > 0 ? Math.round(oldPrice) : undefined,
        discountAmount: discountAmount && discountAmount > 0 ? Math.round(discountAmount) : undefined,
        description,
      });
    }
  }

  return parsedProducts;
}

export const BulkProductUploaderModal: React.FC<BulkProductUploaderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [csvText, setCsvText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedCsvProduct[]>([]);
  const [replaceAll, setReplaceAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleParseText = (text: string) => {
    setCsvText(text);
    if (!text.trim()) {
      setParsedItems([]);
      setStatusMessage(null);
      return;
    }

    try {
      const items = parse7ColumnCsv(text);
      setParsedItems(items);
      if (items.length > 0) {
        setStatusMessage({
          type: 'info',
          text: `Successfully parsed ${items.length} products ready for import.`,
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

  const downloadSampleTemplate = () => {
    const sample = `RESELLING PRICE,CUSTOMER PRICE,product-link src,product NAME,OLD PRICE,DISCOUNTED PRICE,DESCRIPTION
194.25,700,https://www.iuddokta.com/storage/02-Jun-2026/images/1780396725-new_shop_bd_555552_%281%29.jpg,Blue Heart Bottle Locket,833,133,"**Blue Heart Bottle Locket** দৈনন্দিন ব্যবহারের জন্য একটি চমৎকার পণ্য।"
262.50,990,https://www.iuddokta.com/storage/23-Aug-2024/images/1724391053-1723715262-08b200bf-493c-4dae-b18f-81a14e263509.jpg,Powerful Stain Removal,1236,246,"**Powerful Stain Removal** ব্যবহারিক নকশার ঘর ও কাপড়ের দাগ তোলার একটি প্রয়োজনীয় পণ্য।"
525.00,1100,https://www.iuddokta.com/storage/02-Jun-2026/images/1780405353-Under-Bed-Storage-Bag-Quilt-Blanket-Clothes-Storage-Non-Woven-Organizer-BENNYS-73_-_Copy.jpg,Large Under Bed Storage Boxes,1496,396,"**Large Under Bed Storage Boxes** কাপড় ও কম্বল গুছিয়ে রাখার উপযোগী।"`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'shadhin_products_bulk_template.csv');
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
                  7-Column Schema
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload or paste wholesale pricing, customer prices, images, discounts, and Bangla descriptions
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Required 7-Column Order Format:</span>
              </div>

              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
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
                className="w-full h-32 p-3 font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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
                    {parsedItems.slice(0, 30).map((p, idx) => (
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

              {parsedItems.length > 30 && (
                <p className="text-center text-[11px] text-slate-400 italic">
                  Showing first 30 of {parsedItems.length} products. All will be imported to database.
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
