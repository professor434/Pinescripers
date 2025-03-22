export const Card = ({ children }: any) => <div className="rounded-lg border border-white/10 shadow">{children}</div>;
export const CardContent = ({ children, className = "" }: any) => <div className={`p-4 ${className}`}>{children}</div>;