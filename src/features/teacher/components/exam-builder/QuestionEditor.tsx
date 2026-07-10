import React from 'react';
import { Question, Choice, QuestionType } from './types';
import { AnswerChoiceEditor } from './AnswerChoiceEditor';
import { ImageUploadButton } from './ImageUploadButton';
import { GripVertical, Trash2, Plus, Image as ImageIcon, Type, HelpCircle } from 'lucide-react';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onChange: (question: Question) => void;
  onRemove: () => void;
}

export function QuestionEditor({ question, index, onChange, onRemove }: QuestionEditorProps) {
  
  const handleAddChoice = () => {
    const newChoices = [...question.choices, { text: '', isCorrect: false }];
    onChange({ ...question, choices: newChoices });
  };

  const handleChoiceChange = (cIndex: number, newChoice: Choice) => {
    const newChoices = [...question.choices];
    newChoices[cIndex] = newChoice;
    onChange({ ...question, choices: newChoices });
  };

  const handleChoiceRemove = (cIndex: number) => {
    const newChoices = question.choices.filter((_, i) => i !== cIndex);
    onChange({ ...question, choices: newChoices });
  };

  const handleSetCorrect = (cIndex: number) => {
    let newChoices = [...question.choices];
    if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
      newChoices = newChoices.map((c, i) => ({ ...c, isCorrect: i === cIndex }));
    } else if (question.type === 'MULTIPLE_RESPONSE') {
      newChoices[cIndex].isCorrect = !newChoices[cIndex].isCorrect;
    }
    onChange({ ...question, choices: newChoices });
  };

  const handleTypeChange = (newType: QuestionType) => {
    let newChoices = [...question.choices];
    if (newType === 'TRUE_FALSE') {
      newChoices = [
        { text: 'صح', isCorrect: true },
        { text: 'خطأ', isCorrect: false }
      ];
    } else if (question.type === 'TRUE_FALSE') {
      newChoices = [
        { text: 'الخيار 1', isCorrect: true },
        { text: 'الخيار 2', isCorrect: false }
      ];
    }
    // Also reset correct answers if switching from multiple response to single choice
    if (newType === 'MULTIPLE_CHOICE' && question.type === 'MULTIPLE_RESPONSE') {
      newChoices = newChoices.map((c, i) => ({ ...c, isCorrect: i === 0 }));
    }
    onChange({ ...question, type: newType, choices: newChoices });
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm mb-6 transition-all hover:border-primary/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="cursor-move text-text-muted hover:text-foreground">
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center">
            {index + 1}
          </span>
          <select
            value={question.type}
            onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
            className="px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm outline-none"
          >
            <option value="MULTIPLE_CHOICE">اختيار من متعدد (إجابة واحدة)</option>
            <option value="MULTIPLE_RESPONSE">اختيار من متعدد (إجابات متعددة)</option>
            <option value="TRUE_FALSE">صح أم خطأ</option>
            <option value="SHORT_TEXT">إجابة قصيرة</option>
          </select>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">الدرجة:</span>
            <input
              type="number"
              min="1"
              value={question.points}
              onChange={(e) => onChange({ ...question, points: parseInt(e.target.value) || 1 })}
              className="w-16 px-2 py-1 rounded border border-border bg-muted/50 text-center outline-none"
            />
          </div>
          <button 
            onClick={onRemove}
            className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-xl transition-colors"
            title="حذف السؤال"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-4 mb-6">
        <div>
          <textarea
            value={question.text}
            onChange={(e) => onChange({ ...question, text: e.target.value })}
            placeholder="اكتب نص السؤال هنا..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none transition-colors min-h-[100px] text-lg font-medium resize-y"
          />
        </div>
        
        <div className="flex gap-2">
          <ImageUploadButton 
            value={question.imageUrl || ''} 
            onChange={(url) => onChange({ ...question, imageUrl: url })} 
            placeholder="إضافة صورة للسؤال"
          />
        </div>
      </div>

      {/* Choices Area */}
      {question.type !== 'SHORT_TEXT' ? (
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground mb-2">
            الخيارات <span className="text-text-muted font-normal">(حدد الإجابة الصحيحة)</span>
          </label>
          
          {question.choices.map((choice, cIndex) => (
            <AnswerChoiceEditor
              key={cIndex}
              choice={choice}
              index={cIndex}
              questionType={question.type}
              onChange={(newChoice) => handleChoiceChange(cIndex, newChoice)}
              onRemove={() => handleChoiceRemove(cIndex)}
              onSetCorrect={() => handleSetCorrect(cIndex)}
            />
          ))}

          {question.type !== 'TRUE_FALSE' && (
            <button
              onClick={handleAddChoice}
              className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors mt-2"
            >
              <Plus className="w-4 h-4" /> إضافة خيار آخر
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
          <p className="text-sm text-text-muted flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> سيقوم الطالب بكتابة الإجابة نصياً. التصحيح الآلي للأسئلة النصية قيد التطوير.
          </p>
        </div>
      )}

      {/* Explanation Area */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <input
          type="text"
          value={question.explanation || ''}
          onChange={(e) => onChange({ ...question, explanation: e.target.value })}
          placeholder="تفسير الإجابة (يظهر للطالب بعد الحل) - اختياري"
          className="w-full px-4 py-2 text-sm rounded-xl border border-border bg-muted/50 outline-none"
        />
      </div>
    </div>
  );
}
