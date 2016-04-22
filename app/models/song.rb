class Song < ActiveRecord::Base
	belongs_to :room

	validates :url, presence: true, format: {with: /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i}
	before_create :convert_url

	def convert_url
		self.url = url[/(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i, 2]
    self.title = Yt::Video.new(id: self.url).title
	end
	
end