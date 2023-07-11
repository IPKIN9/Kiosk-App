import iziToast from 'izitoast'

export default {
  successNotif(payload) {
    iziToast.success({
      title: payload.title,
      message: payload.message,
      position: 'topRight'
    })
  },

  infoNotif(msg) {
    iziToast.info({
      title: 'Caution',
      message: msg,
      position: 'topRight'
    });
  },


  warningNotif(msg) {
    iziToast.warning({
      title: 'Attention',
      message: msg,
      position: 'topRight'
    });
  },

  errorNotif(msg) {
    iziToast.error(msg);
  },
}