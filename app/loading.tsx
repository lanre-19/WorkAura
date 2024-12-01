import { Loader } from "lucide-react";

const Loading = () => {
    return (
        <div
          className="min-h-screen flex flex-col gap-y-2 items-center justify-center"
        >
          <Loader
            className="size-6 text-muted-foreground animate-spin"
          />
        </div>
    );
}
 
export default Loading;