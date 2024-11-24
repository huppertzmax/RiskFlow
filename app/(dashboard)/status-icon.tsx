"use client"

import { useState, useEffect } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast";

const DISABLE = true

export const StatusIcon = ({ isLoadingAnalysis }: { isLoadingAnalysis: () => Promise<boolean> }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (DISABLE) return;
        const checkStatus = async () => {
            const isLoadingUpdate = await isLoadingAnalysis();
            if (!isLoadingUpdate && isLoading) {
                toast({ 
                    title: "Processing Completed!", 
                    description: "Find your new report in the reports tab!", 
                    variant: "default", 
                    className: "bg-green-200", 
                    duration: 6000 
                });
                console.log("change")
            }
            setIsLoading(isLoadingUpdate);
        };

        // Check immediately on mount
        checkStatus();

        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [isLoadingAnalysis, isLoading]);

    return isLoading ? (<TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger>
                <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" />
            </TooltipTrigger>
            <TooltipContent>
                <p>Risk Analysis is running.</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>) : null;
}