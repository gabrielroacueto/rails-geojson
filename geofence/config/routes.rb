Rails.application.routes.draw do
  get 'geofence/index'

  root 'geofence#index'
  resources :bounds, controller: 'bounds'
  # match '/bounds' => '/bounds_controller#index', via: :get
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
