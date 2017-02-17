class CreateBounds < ActiveRecord::Migration[5.0]
  def change
    create_table :bounds do |t|
      t.string :lat
      t.string :long
      t.string :poly_id

      t.timestamps
    end
  end
end
