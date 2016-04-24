class Room < ActiveRecord::Base
	has_many :songs, dependent: :destroy

	# validates :name, presence: true, uniqueness: true

	def current_song
		songs[self.song_counter]
	end

	def play_song(id)
		song = self.songs.find(id)
		self.update_attributes(song_counter: self.songs.find_index(song))
		song
	end

	def change_song(index)
		if songs[index]
			self.update_attributes(song_counter: index)
			songs[index]
		else
			songs.sample
		end
	end

	def send_text(number)
		@account_sid = ENV['TWILIO_SID']
		@auth_token = ENV['TWILIO_TOKEN']
		@recipient = "+1#{number}"
		@link = "10.10.44.67:3000/rooms/#{self.id}"
		# set up a client
		@client = Twilio::REST::Client.new(@account_sid, @auth_token)
		@client.account.messages.create(
		  from: '+15874001631',
		  to: @recipient,
		  body: @link
		)
	end

end
