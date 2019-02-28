import UserNotifications

class NotificationService: UNNotificationServiceExtension {
  
  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?
  var receivedRequest : UNNotificationRequest!;
  
  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    self.receivedRequest = request;
    
    RCTOneSignalExtensionService.didReceive(self.receivedRequest, with: self.bestAttemptContent);
    
    if let bestAttemptContent = bestAttemptContent {
      contentHandler(bestAttemptContent)
    }
  }
  
  override func serviceExtensionTimeWillExpire() {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    RCTOneSignalExtensionService.serviceExtensionTimeWillExpireRequest(self.receivedRequest, with: self.bestAttemptContent);
    
    if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
      contentHandler(bestAttemptContent)
    }
  }
}
