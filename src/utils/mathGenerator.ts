/**
 * Genera una expresión con sumas/restas cuyo resultado es target (por defecto 15).
 * Devuelve { expression: string, value: number, validate: (v)=>boolean }
 */
export function generateMathExpression(target = 15, terms = 5) {
  const nums: number[] = [];
  const ops: ("+" | "-")[] = [];
  const min = 10;
  const max = 400;

  function randNum() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // generate initial numbers
  for (let i = 0; i < terms - 1; i++) {
    nums.push(randNum());
    ops.push(Math.random() > 0.5 ? "+" : "-");
  }

  // compute sSoFar
  let sSoFar = nums[0] ?? 0;
  for (let i = 0; i < ops.length; i++) {
    const n = nums[i + 1] ?? 0;
    sSoFar = ops[i] === "+" ? sSoFar + n : sSoFar - n;
  }

  const lastOp: "+" | "-" = Math.random() > 0.5 ? "+" : "-";
  let last = lastOp === "+" ? target - sSoFar : sSoFar - target;

  // if last not suitable, fallback to a deterministic expression
  if (Math.abs(last) < 5 || Math.abs(last) > 500) {
    const expr = `583 - 247 + 91 - 432 + 20`;
    return { expression: expr, value: target, validate: (v: number) => v === target };
  }

  const parts: string[] = [];
  parts.push(String(nums[0]));
  for (let i = 0; i < ops.length; i++) {
    parts.push(ops[i]);
    parts.push(String(nums[i + 1] ?? 0));
  }
  parts.push(lastOp);
  parts.push(String(Math.abs(last)));

  const expression = parts.join(" ");
  return {
    expression,
    value: target,
    validate: (v: number) => v === target
  };
}
