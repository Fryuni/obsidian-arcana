import React from 'react';
import { Message, Author } from './Message';
import { TFile } from 'obsidian';
import AIConversation from 'src/Conversation';
import Aborter from 'src/include/Aborter';
import { useArcana } from 'src/hooks/hooks';

class ConvState {
  messageBeingWritten = false;
  currentAIMessage: null | Message = null;
  currentAborter: Aborter = new Aborter();
}

export function useConversation(conversationSystemMessage: () => string) {
  const arcana = useArcana();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [convState, setConvState] = React.useState<ConvState>(new ConvState());

  const [aiConv, setAIConv] = React.useState<AIConversation>(
    arcana.startConversation(conversationSystemMessage())
  );

  const createUserMessage = React.useCallback((text: string) => {
    const message = new Message(Author.User);
    message.addText(text);
    setMessages(msgs => [...msgs, message]);
  }, []);

  const createAIMessage = React.useCallback(() => {
    const message = new Message(Author.AI);
    setMessages(msgs => [...msgs, message]);
    const newConvState = {
      messageBeingWritten: true,
      currentAIMessage: message,
      currentAborter: new Aborter(),
    };
    setConvState(newConvState);
    return newConvState;
  }, []);

  const resetConversation = React.useCallback(() => {
    aiConv.disengage();
    setAIConv(arcana.startConversation(conversationSystemMessage()));
    setMessages([]);
    setConvState(new ConvState());
  }, [aiConv]);

  const addToAIMessage = React.useCallback(
    (message: Message, text: string) => {
      message.addText(text);
      setMessages(msgs => [...msgs]);
    },
    [convState]
  );

  const setConversationContext = React.useCallback(
    (text: string) => {
      aiConv.setContext(text);
    },
    [aiConv]
  );

  const finishAIMessage = React.useCallback(() => {
    setConvState({
      messageBeingWritten: false,
      currentAIMessage: null,
      currentAborter: new Aborter(),
    });
  }, []);

  const cancelAIMessage = React.useCallback(() => {
    convState.currentAborter.abort();
  }, [convState]);

  const isAIReplying = React.useMemo(() => {
    return convState.messageBeingWritten;
  }, [convState]);

  const askQuestion = React.useCallback(
    async (question: string) => {
      const { currentAIMessage, currentAborter } = createAIMessage();
      let firstAborted = false;
      await aiConv
        .askQuestion(
          question,
          (token: string) => {
            if (currentAborter.isAborted()) {
              if (!firstAborted) {
                addToAIMessage(currentAIMessage, ' (message aborted) ');
              }
              firstAborted = true;
              return;
            }
            addToAIMessage(currentAIMessage, token);
          },
          currentAborter.isAborted
        )
        .finally(() => {
          finishAIMessage();
        });
    },
    [convState, addToAIMessage, finishAIMessage, createAIMessage, aiConv]
  );

  return {
    messages,
    createUserMessage,
    //createAIMessage,
    //addToAIMessage,
    askQuestion,
    resetConversation,
    setConversationContext,
    finishAIMessage,
    cancelAIMessage,
    isAIReplying,
  };
}

// TODO: Can ID be ignored
/*
export class Conversation {
  aiConv: AIConversation;
  messages: Map<number, Message> = new Map();

  public constructor(aiConv: AIConversation, messages?: Map<number, Message>) {
    this.aiConv = aiConv;
    this.messages = messages ?? new Map();
  }

  public copy() {
    return new Conversation(this.aiConv, this.messages);
  }
  public setSystemMessage(text: string) {
    this.aiConv.setContext(text);
    return this;
  }

  public createUserMessage(text: string) {
    const id = this.messages.size;
    const message = new Message(Author.User);
    message.addText(text);
    this.messages.set(id, message);
    return this;
  }

  public createAIMessage() {
    const id = this.messages.size;
    const message = new Message(Author.AI);
    this.messages.set(id, message);
    this.currentAIMessage = message;
    this.currentAborter = new Aborter();
    this.messageBeingWritten = true;
    return this;
  }

  public getCurrentAborter(): Aborter {
    return this.currentAborter;
  }

  public isMessageBeingWrittenBack(): boolean {
    return this.messageBeingWritten && !this.currentAborter.isAborted();
  }

  public addToAIMessage(addition: string) {
    this.currentAIMessage?.addText(addition);
    console.log('addToAIMessage', this.currentAIMessage);
    return this;
  }

  public finishAIMessage() {
    this.currentAIMessage = null;
    this.messageBeingWritten = false;
    return this;
  }
}
*/
