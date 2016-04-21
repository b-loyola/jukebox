class Room < ActiveRecord::Base
	has_many :songs, dependent: :destroy

	validates :name, presence: true, uniqueness: true

	def next_song_id
		current_song = songs[song_counter]
		if current_song && (song_counter < songs.size)
			self.song_counter += 1
			self.save
		else
			current_song = songs.sample
		end
		current_song.url
	end

end