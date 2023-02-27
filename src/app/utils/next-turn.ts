
import { delay, MonoTypeOperatorFunction } from "rxjs";

// Prevent ExpressionChangedAfterItHasBeenCheckedError
// https://angular.io/guide/testing-components-scenarios#component-with-async-service
export const nextTurn: () => MonoTypeOperatorFunction<boolean> = () => delay(0);