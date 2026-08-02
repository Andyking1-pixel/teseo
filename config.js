/*
 * Plantilla editable de la invitación.
 * Modifica únicamente los valores de este archivo para personalizar un nuevo evento.
 */
window.invitationConfig = {
  pageTitle: 'Teseo cumple 4 años',
  childName: 'Teseo Santiago',
  age: 4,

  event: {
    day: 30,
    month: 8, // 1 = enero, 8 = agosto, 12 = diciembre
    year: 2026,
    dateLabel: 'AGOSTO',
    time: '14:00', // Formato de 24 horas para el contador.
    timeLabel: '2:00',
    meridiem: 'PM',
    location: 'Terraza Las Palmas',
    mapsUrl: 'https://maps.app.goo.gl/oea4S3SXzyB6B4km7?g_st=iw',
    whatsappNumber: '529221392613',
    whatsappMessage: 'Hola, confirmo mi asistencia al cumpleaños de Teseo.'
  },

  assets: {
    coverImage: 'assets/images/portada.webp',
    mainAudio: 'assets/audio/audio.mp3',
    coinAudio: 'assets/audio/soundcoin.mp3'
  },

  texts: {
    welcomeLevel: '¡Nivel 4 desbloqueado!',
    welcomeCopy: 'te invita a celebrar una aventura muy especial',
    startButtonLineOne: 'Presiona para comenzar',
    startButtonLineTwo: 'la aventura',
    heroEyebrow: '⭐ ¡Nueva aventura desbloqueada!',
    heroBirthday: 'CUMPLE',
    heroYears: 'AÑOS',
    intro: '¡Acompáñanos a celebrar|el cumpleaños de nuestro pequeño héroe!',
    missionTitle: 'LA MISIÓN COMIENZA EN',
    countdownTitle: 'FALTAN',
    locationSubtitle: '¡Aquí estará nuestro Reino Champiñón!',
    mapsButton: '🗺️ Ver ubicación',
    rsvpKicker: '¿LISTO PARA JUGAR?',
    rsvpTitle: 'Confirma tu asistencia',
    whatsappButton: '💬 Confirmar por WhatsApp',
    footer: '¡Te esperamos para esta gran aventura!'
  },

  countdown: {
    targetDate: '2026-08-30T14:00:00-06:00', // 30 de agosto de 2026, 2:00 PM, hora de México.
    labels: {
      days: 'DÍAS',
      hours: 'HRS',
      minutes: 'MIN',
      seconds: 'SEG'
    }
  }
};
