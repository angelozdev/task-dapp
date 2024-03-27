import { cn } from "../../utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "danger" | "success" | "warning" | "info";
}

function Button({ children, color, className, ...props }: Readonly<Props>) {
  return (
    <button
      className={cn(
        "p-2 text-white rounded-lg",
        {
          "bg-blue-500": color === "primary" || color === "info" || !color,
          "bg-red-500": color === "danger",
          "bg-green-500": color === "success",
          "bg-yellow-500": color === "warning",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
