class ChangeCounterToStartAtOne < ActiveRecord::Migration
  def up
  	change_column_default(:rooms, :song_counter, 1)
  end
  def down
  	change_column_default(:rooms, :song_counter, 0)
  end
end
