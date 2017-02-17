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
    polygon = Polygon.new
    polygon.name = params[:polygon_name]
    polygon.save

    # Parse through Google Maps Polygon JSON
    bound_data["features"][0]["geometry"]["coordinates"][0].each do |b|
      bound = Bound.new
      bound.lat = b[0]
      bound.long = b[1]
      bound.polygon_id = polygon.id
      bound.save
    end

  end

  def show
    render text: "Hi, showing create." + Bound.ids.to_s
  end
end
