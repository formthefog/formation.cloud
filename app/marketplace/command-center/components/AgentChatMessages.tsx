import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  Map,
  Heart,
  Backpack,
  Wallet,
  Utensils,
  Shield,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EnhancedChatMessagesProps {
  conversations: { [key: string]: any[] };
  selectedDeployment: any;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatInput: string;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  setUserInput: (text: string) => void;
  sendMessage: (text: string) => void;
}

export default function EnhancedChatMessages({
  conversations = {},
  selectedDeployment = { id: "default" },
  messagesEndRef,
  chatInput,
  handleKeyPress,
  handleSendMessage,
  setUserInput,
  sendMessage,
}: EnhancedChatMessagesProps) {
  // Function to handle clicking on an example prompt
  const handleExampleClick = (promptText: string) => {
    setUserInput(promptText);
    sendMessage(promptText);
  };

  const isConversationEmpty =
    !conversations[selectedDeployment.id] ||
    conversations[selectedDeployment.id].length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-8 mt-24">
          {/* Show example prompts only when conversation is empty */}
          {isConversationEmpty && (
            <div className="py-8 ">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Your {selectedDeployment.agent.name.replace(/-/g, " ")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a suggestion or ask your own travel question
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDeployment.agent.metadata.example_prompts.map(
                  (prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 shadow-sm hover:shadow group"
                    >
                      <div className="flex items-start">
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {prompt}
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Regular conversation messages */}
          {!isConversationEmpty &&
            conversations[selectedDeployment.id]?.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${message.role === "system" ? "justify-center" : ""}`}
              >
                {message.role === "system" ? (
                  <div className="max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-2">
                    <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {message.content}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`max-w-md ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-bl-lg rounded-tl-lg rounded-tr-lg"
                        : message.error
                          ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-br-lg rounded-tr-lg rounded-tl-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-br-lg rounded-tr-lg rounded-tl-lg"
                    } p-3 shadow-sm`}
                  >
                    {message.loading ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                          <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                          <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">
                        {/* Convert markdown to HTML */}
                        {message.role === "agent" ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: message.content
                                .replace(
                                  /### (.*?)\n/g,
                                  '<h3 class="text-lg font-bold mb-2">$1</h3>'
                                )
                                .replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>"
                                )
                                .replace(
                                  /\n- (.*?)(?=\n|$)/g,
                                  '<div class="flex mb-1"><div class="mr-2">•</div><div>$1</div></div>'
                                )
                                .replace(/\n\n/g, '<div class="my-3"></div>'),
                            }}
                          />
                        ) : (
                          message.content
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            value={chatInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="h-[60px] px-6"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
