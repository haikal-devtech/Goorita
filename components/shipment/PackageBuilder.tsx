import { Plus, Trash2, Package, Upload, Download, Image as ImageIcon, Camera } from 'lucide-react';
import { PackageItem, calculateChargeableWeight } from '@/lib/shipping';
import { motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function PackageBuilder({ packages, setPackages, itemType = 'Goods' }: { 
  packages: PackageItem[], 
  setPackages: React.Dispatch<React.SetStateAction<PackageItem[]>>,
  itemType?: string
}) {
  const [error, setError] = useState<string | null>(null);
  
  const isDocuments = itemType.toLowerCase() === 'documents';

  const addPackage = () => {
    setPackages([...packages, { 
      id: Math.random().toString(), 
      size: 'Medium', 
      weight: 1, 
      valueUsd: 50 
    }]);
  };

  const removePackage = (id: string) => {
    if (packages.length > 1) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const updatePackage = (id: string, field: keyof PackageItem, value: any) => {
    setPackages(packages.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;
      
      try {
        const lines = result.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error('Empty or invalid CSV');

        const headers = lines[0].split(',').map(h => h.replace(/["']/g, '').trim().toLowerCase());
        const expectedHeaders = ['package_size', 'length_cm', 'width_cm', 'height_cm', 'weight_kg', 'declared_value_usd', 'unpacked_photo_url', 'box_photo_url'];
        
        if (!headers.includes('package_size') || !headers.includes('weight_kg')) {
          throw new Error('Invalid columns. Required: package_size, weight_kg');
        }

        const newPackages: PackageItem[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length < 2) continue; // Skip empty lines
          
          const pSizeRaw = values[headers.indexOf('package_size')]?.replace(/["']/g, '');
          const pSize = pSizeRaw ? pSizeRaw.charAt(0).toUpperCase() + pSizeRaw.slice(1).toLowerCase() : '';
          const pLength = Number(values[headers.indexOf('length_cm')]?.replace(/["']/g, ''));
          const pWidth = Number(values[headers.indexOf('width_cm')]?.replace(/["']/g, ''));
          const pHeight = Number(values[headers.indexOf('height_cm')]?.replace(/["']/g, ''));
          const pWeight = Number(values[headers.indexOf('weight_kg')]?.replace(/["']/g, ''));
          const pValue = Number(values[headers.indexOf('declared_value_usd')]?.replace(/["']/g, ''));
          
          const unpackedPhoto = headers.indexOf('unpacked_photo_url') > -1 ? values[headers.indexOf('unpacked_photo_url')] : undefined;
          const boxPhoto = headers.indexOf('box_photo_url') > -1 ? values[headers.indexOf('box_photo_url')] : undefined;

          if (!pSize || isNaN(pWeight)) {
              continue;
          }

          newPackages.push({
            id: Math.random().toString(),
            size: pSize as any,
            length: pLength || undefined,
            width: pWidth || undefined,
            height: pHeight || undefined,
            weight: pWeight,
            valueUsd: pValue || 0,
            unpackedPhoto: unpackedPhoto,
            boxPhoto: boxPhoto
          });
        }
        
        setPackages(newPackages);
        setError(null);
      } catch (err) {
        setError("Invalid CSV format. Please use the provided template.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,package_size,length_cm,width_cm,height_cm,weight_kg,declared_value_usd,unpacked_photo_url,box_photo_url\nMedium,40,30,25,1,50,,";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "goorita_shipment_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-[12px] border border-[#e2e8f0] p-6 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow relative z-10"
    >
      <div>
        <p className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[12px] shadow-sm">3</span>
          Shipment Items
        </p>
        <p className="text-[12px] text-slate-500 mt-1 font-medium italic ml-10">Add packages and define their dimensions.</p>
      </div>

      <div className="flex flex-col gap-3 ml-0 md:ml-10">
        {/* CSV Bulk Upload Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-3 rounded-lg border border-slate-200 gap-3">
          <span className="text-[12px] text-slate-500 font-medium">Have multiple packages? Upload a CSV file to fill them in at once.</span>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
            <button 
              type="button"
              onClick={downloadTemplate}
              className="flex-1 sm:flex-none px-3 py-1.5 border border-slate-300 text-slate-600 rounded-md text-[12px] font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Download size={14} /> Template
            </button>
            <label className="flex-1 sm:flex-none cursor-pointer px-3 py-1.5 border border-primary text-primary rounded-md text-[12px] font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                title="Upload CSV"
              />
              <Upload size={14} /> Upload CSV
            </label>
          </div>
        </div>
        
        {error && (
          <div className="text-[12px] text-red-500 font-medium bg-red-50 p-2 rounded-md border border-red-100">
            {error}
          </div>
        )}

        {packages.map((pkg, index) => (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            key={pkg.id} 
            className="p-4 border border-[#e2e8f0] bg-[#f9fafb] rounded-lg relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-primary" />
                Item {index + 1}
              </h4>
              {packages.length > 1 && (
                <button 
                  onClick={() => removePackage(pkg.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors bg-white p-1 rounded-md shadow-sm border border-slate-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Size Preset */}
              {!isDocuments && (
                <div className="col-span-12 md:col-span-3 flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Package Size</label>
                  <select 
                    title="Package Size"
                    className="px-3 py-2 border border-[#e2e8f0] rounded-md text-[13px] outline-none focus:border-primary bg-white w-full transition-all focus:ring-2 focus:ring-primary/20"
                    value={pkg.size}
                    onChange={(e) => updatePackage(pkg.id, 'size', e.target.value)}
                  >
                    <option value="Small">Small (20x20x10cm)</option>
                    <option value="Medium">Medium (40x30x25cm)</option>
                    <option value="Large">Large (50x40x30cm)</option>
                    <option value="Custom">Custom Size</option>
                  </select>
                </div>
              )}

              {/* Dimensions (if custom) */}
              {!isDocuments && (
                <div className="col-span-12 md:col-span-4 grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[11px] font-bold text-slate-500 uppercase text-center">L (cm)</label>
                    <input 
                      type="number" 
                      title="Length"
                      disabled={pkg.size !== 'Custom'}
                      className="px-2 py-2 border border-[#e2e8f0] rounded-md text-[13px] outline-none focus:border-primary disabled:bg-slate-100 text-center w-full transition-all focus:ring-2 focus:ring-primary/20"
                      value={pkg.length || ''}
                      onChange={(e) => updatePackage(pkg.id, 'length', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[11px] font-bold text-slate-500 uppercase text-center">W (cm)</label>
                    <input 
                      type="number" 
                      title="Width"
                      disabled={pkg.size !== 'Custom'}
                      className="px-2 py-2 border border-[#e2e8f0] rounded-md text-[13px] outline-none focus:border-primary disabled:bg-slate-100 text-center w-full transition-all focus:ring-2 focus:ring-primary/20"
                      value={pkg.width || ''}
                      onChange={(e) => updatePackage(pkg.id, 'width', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[11px] font-bold text-slate-500 uppercase text-center">H (cm)</label>
                    <input 
                      type="number" 
                      title="Height"
                      disabled={pkg.size !== 'Custom'}
                      className="px-2 py-2 border border-[#e2e8f0] rounded-md text-[13px] outline-none focus:border-primary disabled:bg-slate-100 text-center w-full transition-all focus:ring-2 focus:ring-primary/20"
                      value={pkg.height || ''}
                      onChange={(e) => updatePackage(pkg.id, 'height', Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Weight */}
              <div className={isDocuments ? "col-span-12 md:col-span-6 flex flex-col gap-[6px]" : "col-span-12 md:col-span-2 flex flex-col gap-[6px]"}>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Weight (kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    title="Weight"
                    min="0.1" step="0.1"
                    className="px-3 pr-7 py-2 border border-[#e2e8f0] rounded-md text-[13px] outline-none focus:border-primary w-full transition-all focus:ring-2 focus:ring-primary/20"
                    value={pkg.weight || ''}
                    onChange={(e) => updatePackage(pkg.id, 'weight', Number(e.target.value))}
                  />
                  <span className="absolute right-2 top-2 text-[12px] text-slate-400">kg</span>
                </div>
              </div>

              {/* Value */}
              {!isDocuments && (
                <div className="col-span-12 md:col-span-3 flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Declared Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[12px] text-slate-500">$</span>
                    <input 
                      type="number" 
                      title="Value"
                      min="1"
                      className="pl-7 pr-3 py-2 border border-[#e2e8f0] rounded-md text-[13px] outline-none focus:border-primary w-full transition-all focus:ring-2 focus:ring-primary/20"
                      value={pkg.valueUsd || ''}
                      onChange={(e) => updatePackage(pkg.id, 'valueUsd', Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Photos (Optional) */}
              {!isDocuments && (
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 ring-offset-2 ring-1 ring-slate-100 px-2 py-0.5 rounded w-fit">
                      <ImageIcon className="h-3 w-3" /> Unpacked Item Photo (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                       <label className="flex-1 cursor-pointer group">
                        <div className="flex items-center justify-between px-3 py-2 border border-[#e2e8f0] bg-white rounded-md text-[12px] hover:border-primary transition-all group-hover:bg-slate-50">
                          <span className={cn("truncate max-w-[120px] font-medium", pkg.unpackedPhoto ? "text-primary" : "text-slate-400")}>
                            {pkg.unpackedPhoto ? "Photo Uploaded" : "Upload Image..."}
                          </span>
                          <Camera className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updatePackage(pkg.id, 'unpackedPhoto', reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {pkg.unpackedPhoto && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={pkg.unpackedPhoto} 
                            alt="Unpacked Preview" 
                            className="h-8 w-8 rounded object-cover border border-slate-200"
                          />
                          <button 
                            onClick={() => updatePackage(pkg.id, 'unpackedPhoto', undefined)}
                            className="text-[10px] font-bold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 ring-offset-2 ring-1 ring-slate-100 px-2 py-0.5 rounded w-fit">
                      <ImageIcon className="h-3 w-3" /> Box / Colly Photo (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                       <label className="flex-1 cursor-pointer group">
                        <div className="flex items-center justify-between px-3 py-2 border border-[#e2e8f0] bg-white rounded-md text-[12px] hover:border-primary transition-all group-hover:bg-slate-50">
                          <span className={cn("truncate max-w-[120px] font-medium", pkg.boxPhoto ? "text-primary" : "text-slate-400")}>
                            {pkg.boxPhoto ? "Photo Uploaded" : "Upload Image..."}
                          </span>
                          <Camera className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updatePackage(pkg.id, 'boxPhoto', reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {pkg.boxPhoto && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={pkg.boxPhoto} 
                            alt="Box Preview" 
                            className="h-8 w-8 rounded object-cover border border-slate-200"
                          />
                          <button 
                            onClick={() => updatePackage(pkg.id, 'boxPhoto', undefined)}
                            className="text-[10px] font-bold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={addPackage}
          className="border border-dashed border-[#e2e8f0] text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 p-3 rounded-lg text-[12px] font-bold text-center transition-colors w-full mt-2"
        >
          + Add Another Item
        </motion.button>
      </div>
    </motion.div>
  );
}
