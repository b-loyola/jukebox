class Song < ActiveRecord::Base
	belongs_to :room

	validates :url, presence: true

	
end