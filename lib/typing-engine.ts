'use client';

import { TypingState, TypingStats, TypingResult } from '@/types/typing';

export class TypingEngine {
  private state: TypingState;
  private onStateChange: (state: TypingState) => void;
  private onStatsChange: (stats: TypingStats) => void;

  constructor(
    text: string,
    onStateChange: (state: TypingState) => void,
    onStatsChange: (stats: TypingStats) => void
  ) {
    this.state = {
      currentPosition: 0,
      startTime: null,
      endTime: null,
      errors: new Set<number>(),
      corrections: new Set<number>(),
      isActive: false,
      isCompleted: false,
      text: text,
      userInput: '',
      totalKeyPresses: 0
    };
    
    this.onStateChange = onStateChange;
    this.onStatsChange = onStatsChange;
  }

  public start(): void {
    if (!this.state.isActive && !this.state.isCompleted) {
      this.state.isActive = true;
      this.state.startTime = Date.now();
      this.notifyStateChange();
    }
  }

  public handleInput(input: string): boolean {
    if (!this.state.isActive || this.state.isCompleted) {
      return false;
    }

    // Автоматически начинаем, если еще не начали
    if (!this.state.startTime) {
      this.start();
    }

    const previousInput = this.state.userInput;
    this.state.userInput = input;
    this.state.currentPosition = input.length;

    // Проверяем символы на ошибки
    for (let i = 0; i < input.length; i++) {
      const expected = this.state.text[i];
      const typed = input[i];
      
      if (expected && typed !== expected) {
        this.state.errors.add(i);
      } else if (this.state.errors.has(i) && typed === expected) {
        // Исправили ошибку
        this.state.errors.delete(i);
        this.state.corrections.add(i);
      }
    }
    
    // Удаляем исправления для позиций, которые больше не в тексте
    for (const pos of this.state.corrections) {
      if (pos >= input.length) {
        this.state.corrections.delete(pos);
      }
    }

    // Проверяем завершение
    if (input.length >= this.state.text.length) {
      this.complete();
      return true;
    }

    this.notifyStateChange();
    this.updateStats();
    return true;
  }

  public handleKeyPress(key: string): boolean {
    if (!this.state.isActive || this.state.isCompleted) {
      if (key.length === 1 || key === ' ') {
        this.start();
        this.state.totalKeyPresses++; // Считаем первое нажатие
      }
      return false;
    }

    // Обработка специальных клавиш
    if (key === 'Backspace') {
      if (this.state.userInput.length > 0) {
        this.state.totalKeyPresses++; // Считаем Backspace как нажатие
        const newInput = this.state.userInput.slice(0, -1);
        return this.handleInput(newInput);
      }
      return false;
    }

    // Обработка обычных символов
    if (key.length === 1) {
      this.state.totalKeyPresses++; // Считаем каждое нажатие
      const newInput = this.state.userInput + key;
      return this.handleInput(newInput);
    }

    return false;
  }

  private complete(): void {
    this.state.isCompleted = true;
    this.state.isActive = false;
    this.state.endTime = Date.now();
    this.notifyStateChange();
    this.updateStats();
  }

  public getResult(): TypingResult | null {
    if (!this.state.isCompleted || !this.state.startTime || !this.state.endTime) {
      return null;
    }

    const totalTime = (this.state.endTime - this.state.startTime) / 1000; // в секундах
    const charactersTyped = this.state.userInput.length;
    const errorsCount = this.state.errors.size;
    const correctionsCount = this.state.corrections.size;
    const correctCharacters = charactersTyped - errorsCount;
    const totalKeyPresses = this.state.totalKeyPresses;
    
    // WPM расчет (стандартное слово = 5 символов)
    const wpm = Math.round((correctCharacters / 5) / (totalTime / 60));
    
    // Точность на основе всех нажатий
    const accuracy = totalKeyPresses > 0 ? Math.round((correctCharacters / totalKeyPresses) * 100) : 0;
    
    // Чистота набора (без исправлений)
    const cleanTypingPercentage = charactersTyped > 0 
      ? Math.round(((charactersTyped - correctionsCount) / charactersTyped) * 100) 
      : 100;

    return {
      wpm,
      accuracy,
      cleanTypingPercentage,
      totalTime,
      errorsCount,
      correctionsCount,
      charactersTyped,
      correctCharacters,
      totalKeyPresses
    };
  }

  private calculateCurrentStats(): TypingStats {
    if (!this.state.startTime) {
      return {
        wpm: 0,
        accuracy: 0,
        cleanTypingPercentage: 100,
        totalTime: 0,
        errorsCount: 0,
        correctionsCount: 0,
        charactersPerSecond: 0,
        totalKeyPresses: 0
      };
    }

    const currentTime = Date.now();
    const totalTime = (currentTime - this.state.startTime) / 1000;
    const charactersTyped = this.state.userInput.length;
    const errorsCount = this.state.errors.size;
    const correctionsCount = this.state.corrections.size;
    const correctCharacters = Math.max(0, charactersTyped - errorsCount);
    const totalKeyPresses = this.state.totalKeyPresses;
    
    // WPM расчет
    const wpm = totalTime > 0 ? Math.round((correctCharacters / 5) / (totalTime / 60)) : 0;
    
    // Точность на основе всех нажатий
    const accuracy = totalKeyPresses > 0 
      ? Math.round((correctCharacters / totalKeyPresses) * 100) 
      : 100;
    
    // Чистота набора (без исправлений)
    const cleanTypingPercentage = charactersTyped > 0 
      ? Math.round(((charactersTyped - correctionsCount) / charactersTyped) * 100) 
      : 100;
    
    // Символы в секунду
    const charactersPerSecond = totalTime > 0 ? Math.round(correctCharacters / totalTime) : 0;

    return {
      wpm: Math.max(0, wpm),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      cleanTypingPercentage: Math.max(0, Math.min(100, cleanTypingPercentage)),
      totalTime,
      errorsCount,
      correctionsCount,
      charactersPerSecond,
      totalKeyPresses
    };
  }

  private updateStats(): void {
    const stats = this.calculateCurrentStats();
    this.onStatsChange(stats);
  }

  private notifyStateChange(): void {
    this.onStateChange({ ...this.state });
  }

  // Геттеры для состояния
  public getCurrentPosition(): number {
    return this.state.currentPosition;
  }

  public getUserInput(): string {
    return this.state.userInput;
  }

  public getText(): string {
    return this.state.text;
  }

  public getErrors(): Set<number> {
    return new Set(this.state.errors);
  }
  
  public getCorrections(): Set<number> {
    return new Set(this.state.corrections);
  }

  public isActive(): boolean {
    return this.state.isActive;
  }

  public isCompleted(): boolean {
    return this.state.isCompleted;
  }

  public reset(newText?: string): void {
    const text = newText || this.state.text;
    this.state = {
      currentPosition: 0,
      startTime: null,
      endTime: null,
      errors: new Set<number>(),
      corrections: new Set<number>(),
      isActive: false,
      isCompleted: false,
      text: text,
      userInput: '',
      totalKeyPresses: 0
    };
    this.notifyStateChange();
    this.updateStats();
  }
}