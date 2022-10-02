module Actionstore
  
  def self.store_id subject
    if subject.nil?
      nil
    elsif subject.is_a? String
      subject
    elsif subject.respond_to? :to_store_id
      subject.to_store_id
    else
      ActionView::RecordIdentifier.dom_id subject
    end
  end

  module ClassMethods
    def has_actionstore
      include Actionstore::InstanceMethods
    end
  end

  module InstanceMethods
    extend ActiveSupport::Concern

    def serialized_changes
      saved_changes.transform_values(&:last)
    end

    def push_update changes
      push_update_into nil, changes
    end
  
    def push_update_into store_id, changes = {}
      Actionstore::Channel.broadcast_to self, store_id: Actionstore.store_id(store_id), action: 'update', changes: changes
    end
  
    def push_event event, data = nil
      Actionstore::Channel.broadcast_to self, action: event, data: data
    end
  end
end