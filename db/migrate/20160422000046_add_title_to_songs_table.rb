class AddTitleToSongsTable < ActiveRecord::Migration
  def change
    add_column :songs, :title, :string, default: "Title Unavailable"
  end
end
