export function eventFire(element: any, eventType: string) {
  if (element.fireEvent) {
    element.fireEvent('on' + eventType);
  } else {
    var eventObj = document.createEvent('Events');
    eventObj.initEvent(eventType, true, false);
    element.dispatchEvent(eventObj);
  }
}