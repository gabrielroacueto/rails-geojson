class GeofenceController < ApplicationController
  def index
    @bounds = Bound.new(params[:geojson])
    logger.debug(@bounds)
    @bounds.save
  end
end
