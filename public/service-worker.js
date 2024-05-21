self.addEventListener('message', function(event) {
  const data = event.data;
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge
  };

  self.registration.showNotification(data.title, options);
});