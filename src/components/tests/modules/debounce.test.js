import { describe, it, expect, vi } from 'vitest';
import { debounce } from '../../modules/debounce';

describe('debounce', () => {
  it('지정된 지연 시간 후에 함수가 호출되어야 합니다.', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(func).toHaveBeenCalled();
    }, 150);
  });

  it('짧은 시간 내에 여러 번 호출된 경우, 마지막 호출만 실행되어야 합니다.', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    setTimeout(() => {
      expect(func).toHaveBeenCalledTimes(1);
    }, 150);
  });

  it('함수에 인자를 전달할 수 있어야 합니다.', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('arg1', 'arg2');

    setTimeout(() => {
      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    }, 150);
  });

  it('여러 번의 디바운스 호출을 올바르게 처리해야 합니다.', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('first');
    setTimeout(() => debouncedFunc('second'), 50);
    setTimeout(() => debouncedFunc('third'), 75);

    setTimeout(() => {
      expect(func).toHaveBeenCalledWith('third');
      expect(func).toHaveBeenCalledTimes(1);
    }, 150);
  });
});
