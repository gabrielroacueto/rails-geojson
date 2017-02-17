class CreatePolygons < ActiveRecord::Migration[5.0]
  def change
    create_table :polygons do |t|
      t.string :name
      t.timestamps
    end
  end
end
