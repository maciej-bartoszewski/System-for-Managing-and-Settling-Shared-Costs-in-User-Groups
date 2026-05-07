import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const basePopupClasses = '!bg-surface dark:!bg-surface-dark !text-primary dark:!text-gray-dark !rounded-2xl !shadow-xl'
const baseHtmlContainerClasses = '!text-gray dark:!text-gray-dark !font-semibold !text-pretty !text-lg md:text-xl'
const baseCloseButtonClasses = '!text-gray dark:!text-gray-dark !border-none !ring-0 !outline-none'
const baseConfirmButtonClasses = '!bg-accent !text-white !rounded-xl !px-6 !py-2 !font-bold !shadow-md hover:!bg-accent/80'

export function showSuccess(info: string) {
  MySwal.fire({
    icon: 'success',
    text: info,
    iconColor: '#35b89d',
    timer: 2000,
    timerProgressBar: true,
    allowOutsideClick: true,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      popup: basePopupClasses,
      htmlContainer: baseHtmlContainerClasses,
      closeButton: baseCloseButtonClasses,
    },
  })
}

export function showError(info: string) {
  MySwal.fire({
    icon: 'error',
    text: info,
    timer: 2000,
    timerProgressBar: true,
    allowOutsideClick: true,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      popup: basePopupClasses,
      htmlContainer: baseHtmlContainerClasses,
      closeButton: baseCloseButtonClasses,
    },
  })
}

export function showConfirm(info: string, confirmText = 'OK') {
  return MySwal.fire({
    icon: 'question',
    text: info,
    iconColor: '#35b89d',
    allowOutsideClick: true,
    showConfirmButton: true,
    confirmButtonText: confirmText,
    showCloseButton: true,
    customClass: {
      popup: basePopupClasses,
      htmlContainer: baseHtmlContainerClasses,
      closeButton: baseCloseButtonClasses,
      confirmButton: baseConfirmButtonClasses,
    },
  })
}
