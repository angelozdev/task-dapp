import { cn } from "../../utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  title: string;
}

function Card({ children, className, title }: Readonly<Props>) {
  return (
    <div
      className={cn(
        "p-4 bg-white shadow-md rounded-lg border border-gray-200",
        className
      )}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}

export default Card;
