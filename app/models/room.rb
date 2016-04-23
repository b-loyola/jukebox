class Room < ActiveRecord::Base
	has_many :songs, dependent: :destroy

	# validates :name, presence: true, uniqueness: true

	def current_song
		songs[song_counter]
	end

	def next_song
		songs[song_counter + 1]
		# current_song = songs[song_counter]
		# if current_song && (song_counter < songs.size)
		# 	increment_counter
		# else
		# 	current_song = songs.sample
		# end
		# current_song
	end

	def increment_counter
		self.song_counter += 1
		self.save
	end

end