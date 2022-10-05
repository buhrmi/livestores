module Actionstore
  class Channel < ActionCable::Channel::Base
    def subscribed
      @subject = GlobalID::Locator.locate_signed params[:sgid]
      return reject unless @subject
      stream_for @subject
      @subject.subscribed self if @subject.respond_to? :subscribed
    end

    def push_update changes
      transmit({action: 'update', changes: changes})
    end

    def push_update_into store_id, changes
      store_id = ActionStore.store_id(store_id)
      transmit({store_id: store_id, action: 'update', changes: changes})
    end

    def push_update_by key, value, changes
      transmit({action: 'update_by', key: key, value: value, changes: changes})
    end

    def push_update_by_into store_id, key, value, changes
      store_id = ActionStore.store_id(store_id)
      transmit({store_id: store_id, action: 'update_by', key: key, value: value, changes: changes})
    end

    def push_append value
      transmit({action: 'append', value: value})
    end

    def push_append_into store_id, value
      store_id = ActionStore.store_id(store_id)
      transmit({store_id: store_id, action: 'append', value: value})
    end

    
    def perform_action data
      @subject.send "perform_#{data['action']}", current_user, *data['args']
    end

    def unsubscribed
      @subject.unsubscribed self if @subject.respond_to? :unsubscribed
    end
  end
end
