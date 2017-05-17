Rails.application.routes.draw do

  root "static_pages#show", page: 'home'
  get "/pages/:page" => "static_pages#show"
  
  namespace :admin do
    resources :job_experiences
  end
  # mount Fae below your admin namespec
  mount Fae::Engine => '/admin'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
