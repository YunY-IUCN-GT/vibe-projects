
import { useEffect, useState } from "react"

export function useActiveSection(sectionIds: string[], offset = 100) {
    const [activeSection, setActiveSection] = useState<string>("")

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = ""

            for (const id of sectionIds) {
                const element = document.getElementById(id)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= offset && rect.bottom >= offset) {
                        currentSection = id
                        break
                    }
                }
            }

            setActiveSection(currentSection)
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll() // Check initially

        return () => window.removeEventListener("scroll", handleScroll)
    }, [sectionIds, offset])

    return activeSection
}
