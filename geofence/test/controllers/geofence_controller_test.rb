require 'test_helper'

class GeofenceControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get geofence_index_url
    assert_response :success
  end

end
