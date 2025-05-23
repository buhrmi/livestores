module ApplicationCable
  class Store
    def initialize subject, channel, store_id = nil
      @channel = channel
      @subject = subject
      @store_id = store_id
    end

    def transmit action, data
      if @subject
        @channel.broadcast_to @subject, ({store_id: @store_id, action: action}).compact.merge(data: data)
      else
        @channel.transmit ({store_id: @store_id, action: action}).compact.merge(data: data)
      end
    end

    def set value
      transmit :set, value
    end

    def merge value
      transmit :merge, value
    end

    def upsert value, key = 'id'
      transmit :upsert, key: key, value: value
    end

    def method_missing method, data
      transmit method, data
    end
  end

  class ScopedChannel
    def initialize channel, subject
      @channel = channel
      @subject = subject
    end

    def store(store_id)
      Store.new(@subject, @channel, store_id)
    end

  end
  class Channel < ActionCable::Channel::Base
    public :transmit

    def self.[](subject)
      ScopedChannel.new(self, subject)
    end

    def store(store_id)
      Store.new(nil, self, store_id)
    end
  end
end
