class CreateBounds < ActiveRecord::Migration[5.0]
  def change
    create_table :bounds do |t|
      t.string :lat
      t.string :long
      t.belongs_to :polygon, foreign_key: true
      t.timestamps
    end
  end
end
