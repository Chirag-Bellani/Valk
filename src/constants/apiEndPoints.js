export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'authenticate-user',
    REGISTER: 'register-user',
    LOGOUT: 'logout-user',
  },
  USER: {
    GET_PROFILE: 'get-user-profile',
    UPDATE_PROFILE: 'update-user-profile',
    DELETE_USER: 'delete-login-user',
    UPDATE_LOGIN_USER_GST_DETAIL: 'update-login-user-gst-detail',
  },

  IMAGE: {
    GET_SLIDER_IMAGES: 'get-banners-list',
  },
  LOCATION: {
    GET_STATE_LIST: 'get-state-list',
  },
  LOAD: {
    FIND_LOAD: 'find-load',
    LATEST_POST_LOADS: 'get-latest-post-loads-list',
    ADD_LOAD: 'add-post-load',
    ADD_LOAD_BY_SHIPPER: 'add-post-load-by-shipper',
    GET_LOAD_DETAIL: 'get-load-by-type-details',
    LOAD_ACCEPT_REJECT: 'load-accept-reject-bid',
  },
  LORRY: {
    ADD_POST_LORRY: 'add-post-lorry',
    GET_LORRY_LIST: 'get-lorry-list',
    GET_PARTY_PROFILE_LIST: 'get-party-profile-list',
    ATTACH_LORRY: 'update-lorry-detail-against-load',
    GET_VERIFIED_LORRY_LIST: 'get-transporter-available-lorries',
  },
  BID: {
    ADD_BID: 'add-bid',
    GET_BIDS_BY_POST_LOAD_ID: 'get-bids-by-post-load-id',
    STORE_LOAD_BID_NEGOTIATE: 'store-load-bid-negotiate',
    GET_MY_BIDS_LIST: 'my-bids-list',
    ADD_BID_IMAGE: 'add-bid-images',
    GET_BID_IMAGE_LIST: 'list-bid-images',
    UPDATE_BANK_DETAILS_BY_BID: 'update-bank-details-by-bid',
  },
  CARGO: {
    GET_CARGO_LIST: 'get-cargo-list',
    ADD_CARGO: 'add-cargo',
  },
  VEHICLE: {
    GET_VEHICLE_CATEGORY_LIST: 'get-vehicle-category-list',
    GET_VEHICLE_TYPE_LIST: 'get-vehicle-type-list',
    GET_VEHICLE_SIZE_LIST: 'get-vehicle-size-list',
    GET_VEHICLE_CURRENT_LOCATION: 'get-vehicle-current-location',
  },
  SHIPPER_PARTY: {
    GET_SHIPPER_PARTY: 'get-shipper-parties-list',
    ADD_SHIPPER_PARTY: 'add-shipper-party',
    EDIT_SHIPPER_PARTY: 'edit-shipper-party',
  },
  NEGOTIATE: {
    SHOW_BID_NEGOTIATION_CHAT: 'show-bid-negotiation-chat',
  },
  STATIC_CONTENT: {
    GET_STATIC_CONTENT_BY_TYPE: 'static-content-by-type',
  },
  DOWNLOAD: {
    DOWNLOAD_LR_OR_INVOICE: 'download-pdf-by-type',
  },
  UPLOAD: {
    UPLOAD_DOCUMENT: 'upload-document',
  },
  NOTIFICATION: {
    NOTIFICATION_LIST: 'get-notification-list',
  },
  BANK: {
    GET_BANK_DETAILS: 'get-bank-detail',
    ADD_BANK_DETAILS: 'add-bank-detail',
  },
  FASTAG_GPS_INSURANCE: {
    ADD_INQUIRY: 'add-service-inquiry',
    FASTAG_GPS_INSURANCE_LIST: 'get-service-list',
  },
  HELPANDSUPPORT: {
    GET_HELP_AND_SUPPORT_LIST: 'get-company-detail',
  },
};
