import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentDeployment } from "@/types/agent";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function AgentChatInput({
  selectedDeployment,
  chatInput,
  setChatInput,
  handleKeyPress,
  handleSendMessage,
}: {
  selectedDeployment: AgentDeployment;
  chatInput: string;
  setChatInput: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
}) {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
      <div className="max-w-3xl mx-auto flex gap-2">
        <Textarea className="min-h-[60px] max-h-[200px] flex-1 bg-gray-100 dark:bg-gray-800 border-0 resize-none" />
        <Button
          onClick={handleSendMessage}
          disabled={
            !chatInput.trim() || selectedDeployment.status !== "success"
          }
          className="bg-blue-600 hover:bg-blue-700 h-[60px] px-4"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </Button>
      </div>
      {selectedDeployment.status !== "success" && (
        <div className="mt-2 text-center text-sm text-red-500">
          This agent is currently {selectedDeployment.status}. You cannot send
          messages until it's running.
        </div>
      )}
    </div>
  );
}
