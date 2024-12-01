import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
    message: string;
}

const PageError = ({
    message = "Something went wrong"
}: PageErrorProps) => {

    return (
        <div
          className="flex flex-col items-center justify-center h-screen"
        >
            <AlertTriangle
              className="size-10 text-neutral-400 mb-2"
            />
            <p
              className="text-sm font-medium text-muted-foreground"
            >
                {message}
            </p>
        </div>
    );
}
 
export default PageError;