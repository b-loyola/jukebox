class AddSongCounterColToRooms < ActiveRecord::Migration
  def change
  	add_column :rooms, :song_counter, :integer, default: 0
  end
end
