import { useRef, useEffect } from "react";

const useInterval = (callback: () => void, delay: number) => {
    const intervalRef: any = useRef(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();
        intervalRef.current = window.setInterval(tick, delay);
        return () => window.clearInterval(intervalRef.current);
    }, [delay]);

    return intervalRef;
}

export default useInterval;
