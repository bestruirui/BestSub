import { useState, useEffect, useRef, RefObject, useCallback } from 'react'

interface UseOverflowDetectionReturn<T extends HTMLElement> {
    containerRef: RefObject<HTMLDivElement | null>
    contentRef: RefObject<T | null>
    isOverflowing: boolean
    checkOverflow: () => void
}

export function useOverflowDetection<T extends HTMLElement = HTMLElement>(): UseOverflowDetectionReturn<T> {
    const [isOverflowing, setIsOverflowing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<T>(null)

    const checkOverflow = useCallback(() => {
        if (containerRef.current && contentRef.current) {
            const containerWidth = containerRef.current.clientWidth
            const contentWidth = contentRef.current.scrollWidth
            const needsScroll = contentWidth > containerWidth
            setIsOverflowing(needsScroll)
        }
    }, [])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(checkOverflow)

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current)
        }

        window.addEventListener('resize', checkOverflow)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', checkOverflow)
        }
    }, [checkOverflow])

    return {
        containerRef,
        contentRef,
        isOverflowing,
        checkOverflow
    }
} 