import { ReactNode } from 'react'

type StoneMenuProps = {
    isOpen: boolean
    onClose: () => void
    children?: ReactNode
}

export function StoneMenu({ isOpen, onClose, children }: StoneMenuProps) {
    return (
        <div
            className={`fixed left-0 top-1/2 -translate-y-1/2 z-30 transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="relative">
                {/* Papyrus Background */}
                <img
                    src="/papyrus/2.svg"
                    alt="Papyrus Panel"
                    className="w-full object-contain"
                    style={{ maxHeight: 'calc(100vh - 100px)', maxWidth: '780px' }}
                />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-40 rounded-full bg-black/50 hover:bg-black/70 p-1 transition-colors"
                    aria-label="Close panel"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Table/Content over papyrus image */}
                <div className="absolute inset-0 flex flex-col pl-60 pr-8 pt-16 overflow-y-auto items-start justify-start z-10">
                    <div className="text-black w-full">
                        <h2 className="text-2xl font-bold mb-4 tracking-wide text-black">PRODUCTION</h2>
                        <table className="w-full text-sm text-black">
                            <thead>
                                <tr className="text-left font-bold text-black">
                                    <th className="text-black">Amount</th>
                                    <th className="text-black">Storage</th>
                                    <th className="text-black">Production</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-black">
                                    <td className="text-black">2.489</td>
                                    <td className="text-black">11.3332</td>
                                    <td className="text-black">0.529 / hour</td>
                                </tr>
                                <tr className="text-black">
                                    <td className="text-black">2.135</td>
                                    <td className="text-black">11.3332</td>
                                    <td className="text-black">0.454 / hour</td>
                                </tr>
                                <tr className="text-black">
                                    <td className="text-black">2.559</td>
                                    <td className="text-black">11.3332</td>
                                    <td className="text-black">0.544 / hour</td>
                                </tr>
                                <tr className="text-black">
                                    <td className="text-black">0.641</td>
                                    <td className="text-black">3.39996</td>
                                    <td className="text-black">0.136 / hour</td>
                                </tr>
                                <tr className="text-black">
                                    <td className="text-black">1.068</td>
                                    <td className="text-black">3.39996</td>
                                    <td className="text-black">0.227 / hour</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="mt-6 w-9/12 rounded bg-orange-600 text-white py-2 font-semibold shadow">Claim Resources</button>
                        <div className="mt-3 text-xs text-left text-black">
                            Last claim: 4 hours ago<br />
                            Next URR Chance: <span role="img" aria-label="icon">🧙‍♂️</span><br />
                            Storage full in: <span role="img" aria-label="icon">🗄️</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
