class ToastManager {
  static success(req, message) {
    req.flash('success', message);
  }

  static error(req, message) {
    req.flash('error', message);
  }

  static warning(req, message) {
    req.flash('warning', message);
  }

  static info(req, message) {
    req.flash('info', message);
  }

  // Para uso em views
  static renderToasts(messages) {
    let toastScript = '<script>';
    
    ['success', 'error', 'warning', 'info'].forEach(type => {
      if (messages[type] && messages[type].length > 0) {
        messages[type].forEach(msg => {
          toastScript += `toastr.${type}('${msg.replace(/'/g, "\\'")}');`;
        });
      }
    });
    
    toastScript += '</script>';
    return toastScript;
  }
}

module.exports = ToastManager;