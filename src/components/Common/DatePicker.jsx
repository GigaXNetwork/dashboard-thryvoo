// import { useState } from "react"
// import { Calendar } from "../ui/calender"
// import { Button } from "../ui/button"
// import { Card } from "../ui/card"
// import { format, subDays, startOfMonth, endOfMonth, startOfYear } from "date-fns"

// const DATE_PRESETS = [
//   { label: "Today", value: "today" },
//   { label: "Last 7 days", value: "last7days" },
//   { label: "Last 30 days", value: "last30days" },
//   { label: "This month", value: "thismonth" },
//   { label: "Last month", value: "lastmonth" },
//   { label: "This year", value: "thisyear" },
// ]

// export default function DateRangePicker() {
//   const [datePreset, setDatePreset] = useState("last7days")
//   const [dateRange, setDateRange] = useState({
//     from: subDays(new Date(), 7),
//     to: new Date(),
//   })

//   const getDateRangeFromPreset = (preset) => {
//     const today = new Date()
//     const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
//     const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

//     switch (preset) {
//       case "today":
//         return { from: startOfToday, to: endOfToday }
//       case "last7days":
//         return { from: subDays(startOfToday, 7), to: endOfToday }
//       case "last30days":
//         return { from: subDays(startOfToday, 30), to: endOfToday }
//       case "thismonth":
//         return { from: startOfMonth(today), to: endOfMonth(today) }
//       case "lastmonth":
//         const lastMonth = subDays(today, today.getDate())
//         return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
//       case "thisyear":
//         return { from: startOfYear(today), to: endOfToday }
//       default:
//         return { from: subDays(startOfToday, 7), to: endOfToday }
//     }
//   }

//   const handlePresetChange = (preset) => {
//     setDatePreset(preset)
//     setDateRange(getDateRangeFromPreset(preset))
//   }

//   const handleDateSelect = (date) => {
//     setDatePreset("custom")
//     if (!dateRange.from || (dateRange.from && dateRange.to)) {
//       setDateRange({ from: date, to: undefined })
//     } else if (date && date < dateRange.from) {
//       setDateRange({ from: date, to: dateRange.from })
//     } else {
//       setDateRange({ ...dateRange, to: date })
//     }
//   }

//   const handleApply = () => {
//     console.log("Applied date range:", dateRange)
//   }

//   return (
//     <div className="w-full space-y-6">
//       {/* Quick Select Presets */}
//       <div className="space-y-3">
//         <label className="text-sm font-semibold text-foreground">Quick Select</label>
//         <div className="flex flex-wrap gap-2">
//           {DATE_PRESETS.map((preset) => (
//             <Button
//               key={preset.value}
//               onClick={() => handlePresetChange(preset.value)}
//               variant={datePreset === preset.value ? "default" : "outline"}
//               size="sm"
//               className="rounded-full"
//             >
//               {preset.label}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <Card className="bg-card text-card-foreground flex-col gap-6 rounded-xl border shadow-sm p-0 hidden sm:flex max-w-xs">
//         <div className="p-3">
//           <Calendar
//             mode="range"
//             selected={{
//               from: dateRange.from,
//               to: dateRange.to,
//             }}
//             onSelect={(range) => {
//               setDatePreset("custom")
//               setDateRange({ from: range?.from, to: range?.to })
//             }}
//             disabled={(date) => date > new Date()}
//             initialFocus
//           />
//         </div>
//       </Card>

//       {/* Selected Range Display */}
//       {dateRange.from && dateRange.to && (
//         <div className="p-4 bg-muted rounded-lg border">
//           <p className="text-sm text-muted-foreground">
//             <span className="font-semibold text-foreground">{format(dateRange.from, "MMM dd, yyyy")}</span>
//             {" — "}
//             <span className="font-semibold text-foreground">{format(dateRange.to, "MMM dd, yyyy")}</span>
//           </p>
//         </div>
//       )}

//       {/* Apply Button */}
//       <Button onClick={handleApply} className="w-full">
//         Apply Filter
//       </Button>
//     </div>
//   )
// }


// import { useState, useRef, useEffect } from "react";
// import { Calendar } from "../ui/calender";
// import { Button } from "../ui/button";
// import { Card } from "../ui/card";
// import { X } from "lucide-react";
// import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns";

// const DATE_PRESETS = [
//     { label: "Today", value: "today" },
//     { label: "Last 5 days", value: "last5days" },
//     { label: "Last 7 days", value: "last7days" },
//     { label: "Last 30 days", value: "last30days" },
//     { label: "Last 3 months", value: "last3months" },
//     { label: "All", value: "all" },
//     { label: "Custom Date", value: "custom" },
// ];

// export default function DateRangePicker() {
//     const [datePreset, setDatePreset] = useState("last7days");
//     const [dateRange, setDateRange] = useState({
//         from: subDays(new Date(), 7),
//         to: new Date(),
//     });
//     const [showCalendar, setShowCalendar] = useState(false);
//     const [tempDateRange, setTempDateRange] = useState(null);
//     const customButtonRef = useRef(null);
//     const calendarRef = useRef(null);

//     const getDateRangeFromPreset = (preset) => {
//         const today = new Date();
//         const startOfToday = startOfDay(today);
//         const endOfToday = endOfDay(today);

//         switch (preset) {
//             case "today":
//                 return { from: startOfToday, to: endOfToday };
//             case "last5days":
//                 return { from: subDays(startOfToday, 5), to: endOfToday };
//             case "last7days":
//                 return { from: subDays(startOfToday, 7), to: endOfToday };
//             case "last30days":
//                 return { from: subDays(startOfToday, 30), to: endOfToday };
//             case "last3months":
//                 return { from: subMonths(startOfToday, 3), to: endOfToday };
//             case "all":
//                 const tomorrow = new Date(today);
//                 tomorrow.setDate(tomorrow.getDate() + 1);
//                 return { from: null, to: tomorrow };
//             default:
//                 return { from: subDays(startOfToday, 7), to: endOfToday };
//         }
//     };

//     const handlePresetChange = (preset) => {
//         if (preset === "custom") {
//             setDatePreset(preset);
//             setShowCalendar(true);
//             setTempDateRange(dateRange); // Store current range for editing
//         } else {
//             setDatePreset(preset);
//             setShowCalendar(false);
//             const newRange = getDateRangeFromPreset(preset);
//             setDateRange(newRange);
            
//             // Log payload for "All" case
//             if (preset === "all") {
//                 console.log("All payload: visitedAt[lt]", format(newRange.to, "yyyy-MM-dd"));
//             }
//         }
//     };

//     const handleDateSelect = (range) => {
//         if (range?.from || range?.to) {
//             setTempDateRange(range);
//         }
//     };

//     const handleApply = () => {
//         if (tempDateRange?.from && tempDateRange?.to) {
//             setDateRange(tempDateRange);
//             console.log("Applied date range:", tempDateRange);
//         }
//         setShowCalendar(false);
//     };

//     const handleCancel = () => {
//         setShowCalendar(false);
//         setTempDateRange(null);
//         // Reset to previous preset if custom was not applied
//         if (datePreset === "custom") {
//             setDatePreset("last7days");
//         }
//     };

//     // Close calendar when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 calendarRef.current && 
//                 !calendarRef.current.contains(event.target) &&
//                 customButtonRef.current &&
//                 !customButtonRef.current.contains(event.target)
//             ) {
//                 handleCancel();
//             }
//         };

//         if (showCalendar) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }
        
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [showCalendar]);

//     return (
//         <div className="w-full mx-auto space-y-4">
//             {/* Quick Select Presets */}
//             <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">Quick Select</label>
//                 <div className="flex flex-wrap gap-2 relative">
//                     {DATE_PRESETS.map((preset) => (
//                         <div 
//                             key={preset.value}
//                             className={preset.value === "custom" ? "relative" : ""}
//                             ref={preset.value === "custom" ? customButtonRef : null}
//                         >
//                             <Button
//                                 onClick={() => handlePresetChange(preset.value)}
//                                 variant={datePreset === preset.value ? "default" : "outline"}
//                                 size="sm"
//                                 className={`rounded-full transition-all ${
//                                     datePreset === preset.value 
//                                         ? "bg-primary text-white shadow-sm" 
//                                         : "bg-white hover:bg-gray-50"
//                                 }`}
//                             >
//                                 {preset.label}
//                             </Button>

//                             {/* Floating Calendar - anchored to Custom Date button */}
//                             {preset.value === "custom" && showCalendar && (
//                                 <div 
//                                     ref={calendarRef}
//                                     className="absolute top-full left-0 mt-2 z-50"
//                                     style={{ minWidth: "320px" }}
//                                 >
//                                     <Card className="border shadow-lg rounded-lg p-4 bg-white">
//                                         {/* Close Button */}
//                                         <button
//                                             onClick={handleCancel}
//                                             className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
//                                             aria-label="Close calendar"
//                                         >
//                                             <X size={20} />
//                                         </button>

//                                         <Calendar
//                                             mode="range"
//                                             selected={tempDateRange || dateRange}
//                                             onSelect={handleDateSelect}
//                                             disabled={(date) => date > new Date()}
//                                             initialFocus
//                                             numberOfMonths={1}
//                                         />

//                                         <div className="mt-3 flex justify-end gap-2">
//                                             <Button 
//                                                 onClick={handleCancel} 
//                                                 variant="outline"
//                                                 size="sm"
//                                             >
//                                                 Cancel
//                                             </Button>
//                                             <Button 
//                                                 onClick={handleApply} 
//                                                 size="sm"
//                                                 disabled={!tempDateRange?.from || !tempDateRange?.to}
//                                             >
//                                                 Apply
//                                             </Button>
//                                         </div>
//                                     </Card>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Selected Range Display */}
//             {dateRange.from && dateRange.to && datePreset !== "all" && (
//                 <Card className="border bg-gray-50 p-3">
//                     <p className="text-sm text-gray-700">
//                         <span className="font-medium">Selected Range: </span>
//                         <span className="font-semibold">{format(dateRange.from, "MMM dd, yyyy")}</span>{" "}
//                         — <span className="font-semibold">{format(dateRange.to, "MMM dd, yyyy")}</span>
//                     </p>
//                 </Card>
//             )}

//             {/* All Time Display */}
//             {datePreset === "all" && (
//                 <Card className="border bg-gray-50 p-3">
//                     <p className="text-sm text-gray-700">
//                         <span className="font-medium">Selected Range: </span>
//                         <span className="font-semibold">All Time</span>
//                         {" "}(up to {format(dateRange.to, "MMM dd, yyyy")})
//                     </p>
//                 </Card>
//             )}
//         </div>
//     );
// }



import { useState, useRef, useEffect } from "react";
import { Calendar } from "../ui/calender";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { X } from "lucide-react";
import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns";

const DATE_PRESETS = [
    { label: "Today", value: "today" },
    { label: "Last 5 days", value: "last5days" },
    { label: "Last 7 days", value: "last7days" },
    { label: "Last 30 days", value: "last30days" },
    { label: "Last 3 months", value: "last3months" },
    { label: "All", value: "all" },
    { label: "Custom Date", value: "custom" },
];

export default function DateRangePicker({ onDateRangeChange }) {
    const [datePreset, setDatePreset] = useState("all");
    const [dateRange, setDateRange] = useState({
        from: null,
        to: new Date(),
    });
    const [showCalendar, setShowCalendar] = useState(false);
    const [tempDateRange, setTempDateRange] = useState(null);
    const customButtonRef = useRef(null);
    const calendarRef = useRef(null);

    const getDateRangeFromPreset = (preset) => {
        const today = new Date();
        const startOfToday = startOfDay(today);
        const endOfToday = endOfDay(today);

        switch (preset) {
            case "today":
                return { from: startOfToday, to: endOfToday };
            case "last5days":
                return { from: subDays(startOfToday, 5), to: endOfToday };
            case "last7days":
                return { from: subDays(startOfToday, 7), to: endOfToday };
            case "last30days":
                return { from: subDays(startOfToday, 30), to: endOfToday };
            case "last3months":
                return { from: subMonths(startOfToday, 3), to: endOfToday };
            case "all":
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return { from: null, to: tomorrow };
            default:
                return { from: subDays(startOfToday, 7), to: endOfToday };
        }
    };

    const handlePresetChange = (preset) => {
        if (preset === "custom") {
            setDatePreset(preset);
            setShowCalendar(true);
            // Don't set tempDateRange - keep calendar empty
            setTempDateRange(null);
        } else {
            setDatePreset(preset);
            setShowCalendar(false);
            const newRange = getDateRangeFromPreset(preset);
            setDateRange(newRange);
            
            // Notify parent component
            if (onDateRangeChange) {
                onDateRangeChange(newRange);
            }
        }
    };

    const handleDateSelect = (range) => {
        if (range?.from || range?.to) {
            setTempDateRange(range);
        }
    };

    const handleApply = () => {
        if (tempDateRange?.from && tempDateRange?.to) {
            setDateRange(tempDateRange);
            
            // Notify parent component
            if (onDateRangeChange) {
                onDateRangeChange(tempDateRange);
            }
            
            console.log("Applied date range:", tempDateRange);
        }
        setShowCalendar(false);
    };

    const handleCancel = () => {
        setShowCalendar(false);
        setTempDateRange(null);
        // Reset to "All" if custom was not applied
        if (datePreset === "custom" && !dateRange.from) {
            setDatePreset("all");
        }
    };

    const handleClear = () => {
        setDatePreset("all");
        setShowCalendar(false);
        setTempDateRange(null);
        const allRange = getDateRangeFromPreset("all");
        setDateRange(allRange);
        
        // Notify parent component
        if (onDateRangeChange) {
            onDateRangeChange(allRange);
        }
    };

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                calendarRef.current && 
                !calendarRef.current.contains(event.target) &&
                customButtonRef.current &&
                !customButtonRef.current.contains(event.target)
            ) {
                handleCancel();
            }
        };

        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCalendar, datePreset]);

    // Initial load - trigger "all" preset
    useEffect(() => {
        const initialRange = getDateRangeFromPreset("all");
        setDateRange(initialRange);
        if (onDateRangeChange) {
            onDateRangeChange(initialRange);
        }
    }, []);

    // Helper to format the selected range display
    const getSelectedRangeText = () => {
        if (datePreset === "all") {
            return "All Time";
        }
        if (dateRange.from && dateRange.to) {
            return `${format(dateRange.from, "MMM dd, yyyy")} — ${format(dateRange.to, "MMM dd, yyyy")}`;
        }
        return "";
    };

    return (
        <div className="w-full mx-auto space-y-4">
            {/* Quick Select Presets */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Quick Select</label>
                <div className="flex flex-wrap items-center gap-2 relative">
                    {DATE_PRESETS.map((preset) => (
                        <div 
                            key={preset.value}
                            className={preset.value === "custom" ? "relative" : ""}
                            ref={preset.value === "custom" ? customButtonRef : null}
                        >
                            <Button
                                onClick={() => handlePresetChange(preset.value)}
                                variant={datePreset === preset.value ? "default" : "outline"}
                                size="sm"
                                className={`rounded-full transition-all ${
                                    datePreset === preset.value 
                                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700" 
                                        : "bg-white hover:bg-gray-50"
                                }`}
                            >
                                {preset.label}
                            </Button>

                            {/* Floating Calendar - anchored to Custom Date button */}
                            {preset.value === "custom" && showCalendar && (
                                <div 
                                    ref={calendarRef}
                                    className="absolute top-full left-0 mt-2 z-50"
                                    style={{ minWidth: "320px" }}
                                >
                                    <Card className="border shadow-lg rounded-lg p-4 bg-white">
                                        {/* Close Button */}
                                        <button
                                            onClick={handleCancel}
                                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
                                            aria-label="Close calendar"
                                        >
                                            <X size={20} />
                                        </button>

                                        <Calendar
                                            mode="range"
                                            selected={tempDateRange}
                                            onSelect={handleDateSelect}
                                            disabled={(date) => date > new Date()}
                                            initialFocus
                                            numberOfMonths={1}
                                        />

                                        <div className="mt-3 flex justify-end gap-2">
                                            <Button 
                                                onClick={handleCancel} 
                                                variant="outline"
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                onClick={handleApply} 
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                                disabled={!tempDateRange?.from || !tempDateRange?.to}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Selected Range Display - Same Row */}
                    {getSelectedRangeText() && (
                        <div className="flex-1 min-w-[200px]">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2 inline-flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Selected Range:</span>
                                <span className="text-sm font-semibold text-indigo-700">{getSelectedRangeText()}</span>
                            </div>
                        </div>
                    )}

                    {/* Clear Button */}
                    {datePreset !== "all" && (
                        <Button
                            onClick={handleClear}
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-white hover:bg-gray-50 border-gray-300"
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
