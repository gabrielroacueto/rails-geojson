class BoundsController < ApplicationController
  def index
    render text: 'Request is working'
  end

  def new
  end

  def create
    render text: params[:geojson_array] # TODO: Geojson is returning a json object in the form of a string. We want to do AJAX Post
                                  # to send the object through the JS instead of a form.
    bound_data = JSON.parse(params[:geojson_array])
    bound = Bound.new
    bound.lat = bound_data["features"][0]["geometry"]["coordinates"][0][0][0]
    bound.long = bound_data["features"][0]["geometry"]["coordinates"][0][0][1]
    bound.poly_id = '233'
    bound.save
  end

  def show
    render text: "Hi, showing create." + Bound.ids.to_s
  end
end
