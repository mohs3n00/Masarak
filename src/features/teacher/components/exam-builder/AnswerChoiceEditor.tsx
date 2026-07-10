import React from 'react';
import { Choice, QuestionType } from './types';
import { ImageUploadButton } from './ImageUploadButton';
import { Trash2, GripVertical, CheckCircle2, Circle, Square, CheckSquare } from 'lucide-react';

interface AnswerChoiceEditorProps {
  choice: Choice;
  index: number;
  questionType: QuestionType;
  onChange: (choice: Choice) => void;
  onRemove: () => void;
  onSetCorrect: () => void;
}

export function AnswerChoiceEditor({ choice, index, questionType, onChange, onRemove, onSetCorrect }: AnswerChoiceEditorProps) {
  
  const isMultipleResponse = questionType === 'MULTIPLE_RESPONSE';
  const isTrueFalse = questionType === 'TRUE_FALSE';
  const isShortText = questionType === 'SHORT_TEXT';

  if (isShortText) return null; // Choices are not managed the same way for short text, or maybe we use them as accepted keywords.

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${choice.isCorrect ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
      {!isTrueFalse && (
        <div className="mt-3 cursor-move text-text-muted hover:text-foreground">
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Correct Toggle */}
      <button 
        type="button"
        onClick={onSetCorrect}
        className={`mt-2 p-1 rounded-full flex-shrink-0 transition-colors ${choice.isCorrect ? 'text-primary' : 'text-text-muted hover:text-foreground'}`}
      >
        {isMultipleResponse ? (
          choice.isCorrect ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />
        ) : (
          choice.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />
        )}
      </button>

      {/* Text Input */}
      <div className="flex-1">
        {isTrueFalse ? (
          <div className="py-2 px-3 font-medium">{choice.text}</div>
        ) : (
          <input
            type="text"
            value={choice.text}
            onChange={(e) => onChange({ ...choice, text: e.target.value })}
            placeholder={`الخيار ${index + 1}`}
            className="w-full px-3 py-2 bg-transparent border-b border-transparent focus:border-primary outline-none transition-colors"
          />
        )}
      </div>

      {/* Image Upload Placeholder */}
      {!isTrueFalse && (
        <div className="flex-shrink-0 mt-1.5">
          <ImageUploadButton 
            value={choice.imageUrl || ''} 
            onChange={(url) => onChange({ ...choice, imageUrl: url })} 
            placeholder="صورة"
          />
        </div>
      )}

      {/* Remove Button */}
      {!isTrueFalse && (
        <button 
          type="button"
          onClick={onRemove}
          className="mt-2 p-1 text-text-muted hover:text-error transition-colors"
          title="حذف الخيار"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
