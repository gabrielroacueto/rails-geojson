Rails.application.routes.draw do
  get 'geofence/index'

  root 'geofence#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
