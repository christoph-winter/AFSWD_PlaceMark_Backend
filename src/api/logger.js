export function validationErrorInput(request, h, error) {
  console.log(`Validation error at Input: \n ${error.message}`);
}
export function validationErrorOutput(request, h, error) {
  console.log(`Validation error at Output: \n ${error.message}`);
}
