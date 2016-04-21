class AddSongsTable < ActiveRecord::Migration
  def change
  	create_table :songs do |t|
  		t.references :room
  		t.string :url
  		t.timestamps null: false
  	end
  end
end
